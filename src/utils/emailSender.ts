import nodemailer from "nodemailer";
import config from "../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_password,
    },
  });

  const info = await transporter.sendMail({
    from: '"Eventlyze 👻" <rockyhaque99@gmail.com>',
    to: email,
    subject: "Reset Password Link",
    text: "Hello world?",
    html,
  });

  // console.log("Message sent: %s", info.messageId);
};

export default emailSender;
