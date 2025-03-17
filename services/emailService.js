const transporter = require('../config/emailConfig');

exports.sendMail = async (toEmail, subject, template, context) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: toEmail,
            subject: subject,
            template: template,
            context: context
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
