import { userModel } from '../services/userModel.js';

const checkUserRole = (roles) => async (req, res, next) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    if (!user_id) {
      throw new Error('User id is required for checking role.');
    }
    const userRole = await userModel.checkUserRoleById(user_id);

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).send('Access denied. Invalid user role.');
    }
  } catch (error) {
    res.status(500).send('An error occurred while checking user role.');
  }
};

export default checkUserRole;
