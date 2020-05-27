"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = require("dotenv");
const fs = require("fs");
const ejs = require("ejs");
dotenv_1.config();
let transporter = nodemailer_1.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD
    }
});
exports.sendSuccessEmail = async (email) => {
    let template = fs.readFileSync('../templates/emailTextSuccess.html', { encoding: 'utf-8' });
    let textToHTML = ejs.render(template);
    await transporter.sendMail({
        from: '"Password Reset -Weigu- " <app.workers19@gmail.com>',
        to: email,
        subject: "Password Reset",
        html: textToHTML
    });
};
exports.sendConfirmationCodeByMail = async (email, confirmationCode) => {
    console.log('COnfirmation code call');
    let template = fs.readFileSync('../templates/emailText.html', { encoding: 'utf-8' });
    let textToHTML = ejs.render(template, {
        confirmationCode
    });
    await transporter.sendMail({
        from: '"Password Redefinition -Weigu- " <app.workers19@gmail.com>',
        to: email,
        subject: "Confirmation Code",
        html: textToHTML
    });
};
//# sourceMappingURL=sendMail.js.map