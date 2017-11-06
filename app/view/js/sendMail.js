const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '15057474067@163.com', // generated ethereal user
        pass: 'item489254c197'  // generated ethereal password
    }
});

let sendMailSync = async (message) => {
    let mailOptions = {
        from: '15057474067@163.com', // sender address 
        to: '944545149@qq.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: message // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}
module.exports = sendMailSync;

// sendMailSync("xixixixi,I am komolei and using nodeMailer module");