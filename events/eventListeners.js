const eventEmitter = require('../events/eventEmitter');
const emailService = require('../services/emailService');


eventEmitter.on('userRegistered', async (user) => {
    console.log(`🔔 New User Registered: ${user.name} (${user.email})`);
    await emailService.sendMail( 
        user.email, 
        "Welcome to Our App!", 
        'welcomeEmail', 
        { name: user.name }
    );
});