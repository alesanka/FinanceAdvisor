import { userModel } from '../models/userModel.js';

export class CheckUserRole {
  constructor(model, roles) {
    (this.model = model), (this.roles = roles);
  }
  async validateUserRole(req, res, next) {
    try {
      const { user_id } = req.body;
      if (!user_id) {
        throw new Error('User id is required for checking role.');
      }
      const userRole = await model.checkUserRoleById(user_id);

      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(403).send('Access denied. Invalid user role.');
      }
    } catch (error) {
      res.status(500).send('An error occurred while checking user role.');
    }
  }
}
export const roleAdmin = new CheckUserRole(userModel, 'admin');
export const roleWorker = new CheckUserRole(userModel, 'worker');
