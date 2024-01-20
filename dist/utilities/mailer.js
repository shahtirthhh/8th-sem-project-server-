"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const MAIL_HOST_CONFIG = {
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY,
    },
};
const TRANSPORTER = nodemailer_1.default.createTransport(MAIL_HOST_CONFIG);
let MAIL_GENERATOR = new mailgen_1.default({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js",
    },
});
exports.send_mail = (to, subject, intro, outro) => {
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
