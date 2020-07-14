import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { join } from 'path';

config();
// create reusable transporter object using the default SMTP transport
let transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PWD, // generated ethereal password
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendSuccessEmail = async (email: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const filename = 'emailTextSuccess.html';
  // send mail with defined transport object

  var template: any = fs.readFileSync(
    join(__dirname, '/../templates/') + filename,
    'utf8',
  );
  
  let textToHTML = ejs.render(template);

  await transporter.sendMail({
    from: '"Password Reset -Weigu- " <yjdeve20@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Password Reset', // Subject line
    html: textToHTML, // html body
  });
};

// async..await is not allowed in global scope, must use a wrapper
export const sendSuccessRegisterEmail = async (email: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const filename = 'emailRegisterSuccess.ejs';
  // send mail with defined transport object

  var template: any = fs.readFileSync(
    join(__dirname, '/../templates/') + filename,
    'utf8',
  );
  
  let textToHTML = ejs.render(template);

  await transporter.sendMail({
    from: '"Account Created -Weigu- " <yjdeve20@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Account Created', // Subject line
    html: textToHTML, // html body
  });
};

// async..await is not allowed in global scope, must use a wrapper
export const sendConfirmationCodeByMail = async (
  email: string,
  confirmationCode: number,
) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport

  // send mail with defined transport object

  let template = fs.readFileSync('../templates/emailText.html', {
    encoding: 'utf-8',
  });
  let textToHTML = ejs.render(template, {
    confirmationCode,
  });

  await transporter.sendMail({
    from: '"Password Redefinition -Weigu- " <yjdeve20@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Confirmation Code', // Subject line
    html: textToHTML, // html body
  });
};
// async..await is not allowed in global scope, must use a wrapper
export const sendRegistarationEmail = async (
  email: string,
  confirmationCode: number,
) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  const filename = 'emailText.html';
  // send mail with defined transport object

  var template: any = fs.createReadStream(
    join(__dirname, '/../templates/') + filename,
    'utf8',
  );
  let textToHTML = ejs.render(template);

  await transporter.sendMail({
    from: '"Password Redefinition -Weigu- " <yjdeve20@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Confirmation Code", // Subject line
    html: textToHTML // html body
  });
};


/// login with a magic link 

// async..await is not allowed in global scope, must use a wrapper
export const magicLinkEmail = async (email: string,link: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const filename = 'magicLinkTemplate.ejs';
  // send mail with defined transport object

  var template: any = fs.readFileSync(
    join(__dirname, '/../templates/') + filename,
    'utf8',
  );
  
  let textToHTML = ejs.render(template,{
    email,link
  });

  await transporter.sendMail({
    from: '"MagicLink authentication -Weigu- " <yjdeve20@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Login into Weigu', // Subject line
    html: textToHTML, // html body
  });
};