/* eslint-disable no-undef */
import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    const mailOptions = {
      from: `"Blood Connect | Pragya" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // email body
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(info);
    return info;
  } catch (error) {
    console.log(error?.message);
    return error.message;
  }
};

console.log("MAIL CONFIG:", process.env.MAIL_HOST, process.env.MAIL_PORT);

export default mailSender;
