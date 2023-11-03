import { DBForTokens } from './dbForTokens.js';

const db = new DBForTokens();

db.saveClient({
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET,
  grants: ['password', 'refresh_token'],
});

export { db };
