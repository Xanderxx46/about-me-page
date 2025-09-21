// Middleware to check if user is authenticated and authorized
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware to check if user is authorized (specific Discord ID)
const isAuthorized = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    
    const authorizedDiscordId = process.env.AUTHORIZED_DISCORD_ID;
    
    if (!authorizedDiscordId) {
        console.error('AUTHORIZED_DISCORD_ID not set in environment variables');
        return res.status(500).render('error', { 
            error: 'Server configuration error. Please contact the administrator.' 
        });
    }
    
    if (req.user.discord_id !== authorizedDiscordId) {
        return res.status(403).render('error', { 
            error: 'Access denied. You are not authorized to access this area.' 
        });
    }
    
    next();
};

module.exports = {
    isAuthenticated,
    isAuthorized
};
