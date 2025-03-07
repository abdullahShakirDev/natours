const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user,url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.from = `Natours Company <${process.env.EMAIL_FROM}>`
    }
    newTransport(){
        if(process.env.NODE_ENV==='production'){
            // sendGrid
            return 1;
        }

        // 1) Create a transporter
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(template,subject){
        // 1) render HTML based on pug template

        // 2) define email options

        const mailOptions = {
            from: this.from,
            to:this.to,
            subject,
            text: options.message,
            // html:
        }

        // 3) Create a transport and send email

        await this.newTransport().sendMail(mailOptions);


    }

   async sendWelcome(){
      await this.send('Welcome','Welcome to Natrous family!')
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token (Valid for only 10 min)')
    }
};
