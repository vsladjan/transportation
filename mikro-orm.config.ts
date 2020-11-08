import config from "./config.json";

export default {
    entities: ['./models/mikroorm/entities/**/*.js'],
        debug: true,
        dbName:  'transportation',
        type: 'mysql',
        user: config.db_username,
        password: config.db_password
  };