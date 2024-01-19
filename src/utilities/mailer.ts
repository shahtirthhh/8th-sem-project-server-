import "dotenv/config";

import NODEMAILER from "nodemailer";
import MAINGEN from "mailgen";

const MAIL_HOST_CONFIG = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_KEY,
  },
};
const TRANSPORTER = NODEMAILER.createTransport(MAIL_HOST_CONFIG);
let MAIL_GENERATOR = new MAINGEN({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

exports.send_mail = (
  to: string,
  subject: string,
  intro: string,
  outro: string
) => {
  const mail = MAIL_GENERATOR.generate({ body: { intro, outro } });
  const message = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: mail,
  };
  TRANSPORTER.sendMail(message)
    .then(() => {
      console.log(`Mail sent successfully to: ${to}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
