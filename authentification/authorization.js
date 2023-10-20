import { User } from '../blueprints/user';
import bcrypt from 'bcrypt';

const user = new User();

export class Authorization {
  registerUser = async (req, res) => {
    try {
      const { login, password } = req.body;

      const existingUser = await user.getUserByLogin(login);
      if (existingUser) {
        return res.status(409).send(`User with this login already exists`);
      }

      if (password.length < 8) {
        return res.status(400).send({
          success: false,
          message: 'Password should be at least 8 characters long',
        });
      }

      await user.registerUser(login, password);
      res.status(201).send('User was registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while registration');
    }
  };
  loginUser = async (req, res) => {
    try {
      const { login, password } = req.body;
      const existingUser = await user.getUserByLogin(login);
      if (!existingUser) {
        return res.status(400).send('Login is incorrect');
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        return res.status(400).send('Password is incorrect');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while log in');
    }
  };
}
