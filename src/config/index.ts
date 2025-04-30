import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_secret_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRESIN,
    refresh_secret_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRESIN,
    reset_pass_secret: process.env.RESET_PASSWORD_TOKEN,
    reset_pass_secret_expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRESIN
  },
  bcrypt: {
    salt_round: parseInt(process.env.SALT_ROUND || '12')
  },
  reset_pass_link: process.env.RESET_PASSWORD_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD
  }
};