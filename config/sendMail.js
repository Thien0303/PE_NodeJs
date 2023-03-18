const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const sendMail = asyncHandler(async({email, html}) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"WorldCup2022" <no-relply@worldcup2022.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot password", // Subject line
        html: html, // html body
    });

    return info  
})
module.exports = sendMail