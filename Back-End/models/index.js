import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from '../config/database.js';
import UserModel from './User.js';
import JokeModel from './Joke.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};

// Initialize models
db.User = UserModel(sequelize);
db.Joke = JokeModel(sequelize);

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
export const { User, Joke } = db;