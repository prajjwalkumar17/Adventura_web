const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //TODO create a transporter

  const transporter = nodemailer.createTransport({
    //   service:'Gmail'
    host: process.env.PASSWORDRESET_EMAIL_DOMAIN,
    port: process.env.PASSWORDRESET_EMAIL_PORT,
    auth: {
      user: process.env.PASSWORDRESET_EMAIL_USERNAME,
      pass: process.env.PASSWORDRESET_EMAIL_PASSWORD,
    },
    //Activate in gmail less secure options
  });
  // var transporter = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: 'c0c754b43bf4ba',
  //     pass: '3284660c80f121',
  //   },
  // });
  //TODO define an email options
  const mailOptions = {
    from: 'Rejointech Notifications<notifications@rejointech>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };
  //TODO Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
