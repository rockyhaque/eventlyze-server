import nodemailer from "nodemailer";
import config from "../config";

const emailSender = async (to: string, subject: string, text: string,  html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_password,
    },
  });

  await transporter.sendMail({
    from: `"Eventlyze 👻" <${config.emailSender.email}>`,
    to,
    subject,
    text,
    html,
  });

  // console.log("Message sent: %s", info.messageId);
};

export default emailSender;
