require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
    let testAccount = null;

    // If environment variables are not set, create a test Ethereal account
    if (!process.env.SMTP_HOST) {
        testAccount = await nodemailer.createTestAccount();
        console.log('Using Ethereal test account:', testAccount);
    }

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || testAccount.smtp.host,
        port: Number(process.env.SMTP_PORT) || 465,  // Try 465 instead of 587
        secure: false,  // Must be true for 465
        auth: {
            user: process.env.SMTP_USER || testAccount.user,
            pass: process.env.SMTP_PASS || testAccount.pass
        },
        tls: {
            rejectUnauthorized: false, // Helps with self-signed SSL issues
        },
        debug: true,
        logger: true
    });

    // Message object
    const message = {
        from: `Sender Name <${process.env.SMTP_USER || testAccount.user}>`,
        to: 'Recipient <parth.nakum@radixweb.com>',
        subject: 'Nodemailer is Unicode Friendly ✔',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
    };

    // Send mail
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.error('Error occurred:', err.message);
            return process.exit(1);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
})();
