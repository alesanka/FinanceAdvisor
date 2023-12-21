import { userModel } from '../models/userModel.js';

export const checkAllRequiredParamsForToken = (body) => {
  const requiredFields = [
    'grant_type',
    'scope',
    'client_id',
    'client_secret',
    'username',
    'password',
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`Missing parameter: "${field}" in requst body`);
    }
  }
  return true;
};

export class AuthenticationController {
  constructor(userModel) {
    this.userModel = userModel;
  }
  authenticateUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      checkAllRequiredParamsForToken(req.body);

      const role = await this.userModel.loginUser(username, password);
      console.log('HERE', role);
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

export const authenticationController = new AuthenticationController(userModel);
