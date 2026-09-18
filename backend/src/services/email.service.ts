
import renderEmailTemplate from "../utils/email.render";
import sendEmail from "../utils/mailer";

const sendResetPasswordEmail = async (data:any) => {
  const { email, fullName, resetToken } = data;

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  const logoUrl= `https://skills-and-trades.s3.us-east-2.amazonaws.com/blogs/1776667066794-logo.png`
  const frontendUrl="http://localhost:5173"

  const html = await renderEmailTemplate("reset-password", {
    userName: fullName,
    resetToken,
    logoUrl,
    frontendUrl,
  });

  await sendEmail(email, "Reset Password", html);
};

export default sendResetPasswordEmail;
