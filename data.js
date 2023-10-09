import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

export const config = {
    PORT: env.PORT,
    MONGO_URL: env.MONGO_URL,
    MONGO_URL_TEST: env.MONGO_URL_TEST,
    DAO: env.DAO,
    SECRET: env.cookie_secret,
    twilio : {
        accountSid:env.TWILIO_ACCOUNT_SID,
        authToken: env.TWILIO_AUTH_TOKEN,
        phoneNumber: env.TWILIO_PHONE
    },
    mail:{
        host: env.MAIL_HOST,
        port: 587,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      ENVIROMENT: env.ENVIROMENT,
      stripe_key: env.STRIPE_KEY,
      stripe_secret_key: env.STRIPE_SECRET_KEY
  };

export default config
