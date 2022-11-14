const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_SENDER,
            pass: 'ksstfrkcjwpjhfes'
            }
        });
    }
    
      
    sendConfirmationEmail = (receiving, token) => {
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: receiving,
            subject: 'Sending Email using Node.js',
            text: 'Confirm ypur registration',
            html: `<a href="https://2b4.app/cub-it/api/auth/registration/${token}">Confirm</a>`
        };
    
        this.transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = new MailSender()
