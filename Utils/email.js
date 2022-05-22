const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// new Email(user,url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `{$process.env.EMAIL_FROM}`;
  }

  // newCreateTransport() {
  //   // if (process.env.NODE_ENV === 'production') {
  //   //   //sendgrid
  //   //   return 1;
  //   // }
  //   return nodemailer.createTransport({
  //     host: process.env.PASSWORDRESET_EMAIL_DOMAIN,
  //     port: process.env.PASSWORDRESET_EMAIL_PORT,
  //     auth: {
  //       user: process.env.PASSWORDRESET_EMAIL_USERNAME,
  //       pass: process.env.PASSWORDRESET_EMAIL_PASSWORD,
  //     },
  //   });
  // }

  //send the actual email
  async send(template, subject) {
    //1)render html based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    //3)create a transport and send email
    const transporter = nodemailer.createTransport({
      host: process.env.PASSWORDRESET_EMAIL_DOMAIN,
      port: process.env.PASSWORDRESET_EMAIL_PORT,
      auth: {
        user: process.env.PASSWORDRESET_EMAIL_USERNAME,
        pass: process.env.PASSWORDRESET_EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Adventura Family!');
  }
};

// const sendEmail = async (options) => {
//   //TODO create a transporter
//   // const transporter = nodemailer.createTransport({
//   //   //   service:'Gmail'
//   //   host: process.env.PASSWORDRESET_EMAIL_DOMAIN,
//   //   port: process.env.PASSWORDRESET_EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.PASSWORDRESET_EMAIL_USERNAME,
//   //     pass: process.env.PASSWORDRESET_EMAIL_PASSWORD,
//   //   },
//   //   //Activate in gmail less secure options
//   // });
//BUG not use use above one
//   // var transporter = nodemailer.createTransport({
//   //   host: 'smtp.mailtrap.io',
//   //   port: 2525,
//   //   auth: {
//   //     user: 'c0c754b43bf4ba',
//   //     pass: '3284660c80f121',
//   //   },
//   // });
//   //TODO define an email options
//   // const mailOptions = {
//   //   from: 'Rejointech Notifications<notifications@rejointech>',
//   //   to: options.email,
//   //   subject: options.subject,
//   //   text: options.message,
//   //   //html
//   // };
//   //TODO Actually send the email
//   // await transporter.sendMail(mailOptions);
// };
// module.exports = sendEmail;
