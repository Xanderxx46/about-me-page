// Middleware to check if request is from authorized IP
const isAuthorizedIP = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const authorizedIP = process.env.AUTHORIZED_IP;
    
    // If no authorized IP is set, allow all IPs (fallback)
    if (!authorizedIP) {
        req.isAuthorizedIP = true;
        return next();
    }
    
    // Check if client IP matches authorized IP
    if (clientIP === authorizedIP || clientIP.includes(authorizedIP)) {
        req.isAuthorizedIP = true;
    } else {
        req.isAuthorizedIP = false;
    }
    
    next();
};

export { isAuthorizedIP };
