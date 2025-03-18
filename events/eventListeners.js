const eventEmitter = require('../events/eventEmitter');
const emailService = require('../services/emailService');
logger = require('../utils/logger');


eventEmitter.on('userRegistered', async (user) => {
    logger.info(`🔔 New User Registered: ${user.name} (${user.email})`);
    await emailService.sendMail( 
        user.email, 
        "Welcome to Our App!", 
        'welcomeEmail', 
        { name: user.name }
    );
});