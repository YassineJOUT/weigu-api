"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = require("dotenv");
const fs = require("fs");
const ejs = require("ejs");
const path_1 = require("path");
dotenv_1.config();
let transporter = nodemailer_1.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
    },
});
exports.sendSuccessEmail = async (email) => {
    const filename = 'emailTextSuccess.html';
    var template = fs.readFileSync(path_1.join(__dirname, '/../templates/') + filename, 'utf8');
    let textToHTML = ejs.render(template);
    await transporter.sendMail({
        from: '"Password Reset -Weigu- " <yjdeve20@gmail.com>',
        to: email,
        subject: 'Password Reset',
        html: textToHTML,
    });
};
exports.sendSuccessRegisterEmail = async (email) => {
    const filename = 'emailRegisterSuccess.ejs';
    var template = fs.readFileSync(path_1.join(__dirname, '/../templates/') + filename, 'utf8');
    let textToHTML = ejs.render(template);
    await transporter.sendMail({
        from: '"Account Created -Weigu- " <yjdeve20@gmail.com>',
        to: email,
        subject: 'Account Created',
        html: textToHTML,
    });
};
exports.sendConfirmationCodeByMail = async (email, confirmationCode) => {
    let template = fs.readFileSync('../templates/emailText.html', {
        encoding: 'utf-8',
    });
    let textToHTML = ejs.render(template, {
        confirmationCode,
    });
    await transporter.sendMail({
        from: '"Password Redefinition -Weigu- " <yjdeve20@gmail.com>',
        to: email,
        subject: 'Confirmation Code',
        html: textToHTML,
    });
};
exports.sendRegistarationEmail = async (email, confirmationCode) => {
    const filename = 'emailText.html';
    var template = fs.createReadStream(path_1.join(__dirname, '/../templates/') + filename, 'utf8');
    let textToHTML = ejs.render(template);
    await transporter.sendMail({
        from: '"Password Redefinition -Weigu- " <yjdeve20@gmail.com>',
        to: email,
        subject: "Confirmation Code",
        html: textToHTML
    });
};
exports.magicLinkEmail = async (email, link) => {
    const filename = 'magicLinkTemplate.ejs';
    var template = fs.readFileSync(path_1.join(__dirname, '/../templates/') + filename, 'utf8');
    let textToHTML = ejs.render(template, {
        email, link
    });
    await transporter.sendMail({
        from: '"MagicLink authentication -Weigu- " <yjdeve20@gmail.com>',
        to: email,
        subject: 'Login into Weigu',
        html: textToHTML,
    });
};
//# sourceMappingURL=sendMail.js.map