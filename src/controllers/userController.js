import { userRepos } from '../repositories/userRepos.js';

class UserController {
  registerUser = async (req, res) => {
    try {
      const {
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        salary,
        credit_story,
      } = req.body;

      const requiredFields = [
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'phone_number',
        'role',
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).send(`Missing required field: ${field}`);
        }
      }

      const id = await userRepos.registerUser(
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        salary,
        credit_story
      );
      res.status(201).send(`User was registered successfully. Id - ${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during user registration',
        error: err.message,
      });
    }
  };

  // to get all users in this method as well
  filterByParameter = async (req, res) => {
    try {
      if (Object.keys(req.query).length === 0) {
        const users = await userRepos.getAllUsers();
        return res.status(200).json(users);
      }

      const params = req.query;

      const users = await userRepos.filterByParameter(params);

      if (!users.length) {
        return res.status(404).send('No users found matching the criteria.');
      }

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  getUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userRepos.getUserById(userId);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: err.message });
    }
  };

  changeData = async (req, res) => {
    const userId = req.params.userId;
    if (!req.body) {
      return res.status(400).send('No data provided in request body.');
    }

    try {
      await userRepos.changeData(userId, req.body);

      res
        .status(200)
        .send(`User's data with id - ${userId} was updated successfully.`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
      await userRepos.deleteUser(userId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const userController = new UserController();
