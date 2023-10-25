import { User } from '../blueprints/user.js';
import { DBForTokens } from '../db/dbForTokens.js';
import { createModel } from '../blueprints/model.js';
import { Request, Response } from '@node-oauth/oauth2-server';
import bcrypt from 'bcrypt';

const user = new User();
const db = new DBForTokens();
const saltRounds = 10;

db.saveClient({
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET,
  grants: ['refresh_token', 'password'],
});

class Authentication {
  registerUser = async (req, res) => {
    try {
      const { username, password } = req.body;

      // const existingUser = await user.findUserByUsername(username);
      // if (existingUser) {
      //   return res.status(409).send(`User with this username already exists`);
      // }

      if (password.length < 8) {
        return res.status(400).send({
          success: false,
          message: 'Password should be at least 8 characters long',
        });
      }
      await user.registerUser(username, password);
      res.status(201).send('User was registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while registration Gy');
    }
  };
  authenticateUser = async (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    try {
      const { username, password } = request.body;
      const existingUser = await user.findUserByUsername(username);
      if (!existingUser) {
        return response.status(400).send('Username is incorrect');
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        return response.status(400).send('Password is incorrect');
      }
      request.body.user_id = existingUser.id;
      next();
    } catch (err) {
      console.error(err);
      response.status(500).send('Server error while log in');
    }
  };
}

export const authentication = new Authentication();
export const model = createModel(db, user);
