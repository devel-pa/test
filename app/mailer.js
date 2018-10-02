var nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport({
    service: process.env.SMTP_AUTH_SERVICE,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
});

const sendEmail = (to, uuid) => {
    // Message object
    var message = {
        from: 'noreply@example.com',
        to,
        subject: 'verification code',
        // plaintext body
        text: `Check you code to enable account: http://localhost:8080/verify/${uuid}`,
        
        // HTML body
        html:`Check you code to enable account: <a href="http://localhost:8080/verify/${uuid}">Verify</a>`
    };
    
    transport.sendMail(message, function(error) {
        if(error){
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
    });
};

module.exports = sendEmail;
