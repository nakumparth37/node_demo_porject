const transporter = require('../config/emailConfig');
const logger = require('../utils/logger');

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
        logger.info('Email sent:', info.messageId);
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
}
