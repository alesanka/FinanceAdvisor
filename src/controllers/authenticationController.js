import { userRepos } from '../repositories/userRepos.js';

class AuthenticationController {
  authenticateUser = async (req, res, next) => {
    try {
      const {
        grant_type,
        scope,
        client_id,
        client_secret,
        username,
        password,
      } = req.body;

      if (scope !== 'admin' && scope !== 'worker') {
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
              .send(`Missing field: "${field}" in requst body`);
          }
        }

        if (grant_type !== 'password') {
          return res.status(400).send('Invalid value for grant_type');
        }
      }

      const existingUser = await userRepos.findUserByUsername(username);
      if (!existingUser) {
        return res.status(400).send('Username is incorrect');
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        return res.status(400).send('Password is incorrect');
      }
      if (scope === 'admin' || scope === 'worker') {
        next();
      } else {
        return res.status(200).send('Client logged in successfully');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const authenticationController = new AuthenticationController();
