import { userModel } from '../models/userModel.js';

class UserController {
  registerUser = async (req, res) => {
    try {
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
          return res.status(400).send(`Missing required parameter: ${field}`);
        }
      }

      const id = await userModel.registerUser(req.body);
      res.status(201).send(`User was registered successfully. Id - ${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during user registration',
        error: err.message,
      });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.getAllUsers();

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during getting all users.',
        error: err.message,
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await userModel.getUserById(req.params.userId);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(404).json({
        message: `Something went wrong during getting user ${req.params.userId}.`,
        error: err.message,
      });
    }
  };
  filterByParameter = async (req, res) => {
    try {
      const users = await userModel.filterByParameter(req.query);
      if (!users.length) {
        return res.status(404).send('No users found matching the criteria.');
      }
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(404).json({
        message: `Something went wrong during getting users by parameters.`,
        error: err.message,
      });
    }
  };

  updateData = async (req, res) => {
    try {
      await userModel.updateData(req.params.userId, req.body);
      res
        .status(200)
        .send(
          `User's data with id - ${req.params.userId} was updated successfully.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong during updating user's data.`,
        error: err.message,
      });
    }
  };
  deleteUser = async (req, res) => {
    try {
      await userModel.deleteUser(req.params.userId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting user.`,
        error: err.message,
      });
    }
  };
}

export const userController = new UserController();
