import nodemailer from "nodemailer"
import { config } from "dotenv";
config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendEmail = async (to:string, subject:string, html:any) => {
  console.log("email sent")
  return transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    html,
  });
};

export default sendEmail;
