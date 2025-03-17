const nodemailer = require('nodemailer');
const path = require('path');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure:  process.env.SMTP_PORT === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is Ready to Send Emails");
    }
});


(async () => {
    const { default: hbs } = await import('nodemailer-express-handlebars');

    const handlebarOptions = {
        viewEngine: {
            extName: '.hbs',
            partialsDir: path.resolve('./templates/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./templates/'),
        extName: '.hbs'
    };

    transporter.use('compile', hbs(handlebarOptions));
})();

module.exports = transporter;