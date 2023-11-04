import { userModel } from '../services/userModel.js';

class AuthenticationController {
  authenticateUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const requiredFields = [
        'grant_type',
        'scope',
        'client_id',
        'client_secret',
        'username',
        'password',
      ];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res
            .status(400)
            .send(`Missing parameter: "${field}" in requst body`);
        }
      }
      const role = await userModel.loginUser(username, password);
      if (role === 'admin' || role === 'worker') {
        next();
      } else {
        return res.status(200).send('User logged in successfully');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during attempt to log in user.',
        error: err.message,
      });
    }
  };
}

export const authenticationController = new AuthenticationController();
