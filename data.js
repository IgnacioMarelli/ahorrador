import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

export const config = {
    PORT: env.PORT,
    MONGO_URL: env.MONGO_URL,
    DAO: env.DAO,
    SECRET: env.cookie_secret,
    ENVIROMENT: env.ENVIROMENT,
  };

export default config
