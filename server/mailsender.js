const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_SENDER_PASSWORD
            }
        });
    }

    generateConfirmationToken = ( first_name, last_name, email, password ) => {
        const payload = { first_name, last_name, email, password };
        return jwt.sign(payload, process.env.MAIL_TOKEN, { expiresIn: process.env.MAIL_TOKEN_LIFE});
    }
    
    parseConfirmationToken = (token) => {
        return jwt.verify(token, process.env.MAIL_TOKEN);
    }
      
    sendConfirmationEmail = (receiving, token) => {
        return new Promise(( resolve, reject) => {
            const mailOptions = {
                from: process.env.EMAIL_SENDER,
                to: receiving,
                subject: 'Sending Email using Node.js',
                text: 'Confirm ypur registration',
                html: `<a href="https://2b4.app/cub-it/api/auth/registration/${token}">Confirm</a>`
            };
        
            this.transporter.sendMail(mailOptions, function(err, info) {
                if (err)
                    return reject(new Error('Email sent error'));
                else 
                    return resolve(`Email sent: ${info.response}`)
                
            });
        })
        
    }
}

module.exports = new MailSender()
