import express from 'express';
import passport from 'passport';
const router = express.Router();

// Discord OAuth routes
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to admin panel
        res.redirect('/admin');
    }
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login'
    });
});

// Session refresh endpoint
router.post('/session-refresh', (req, res) => {
    if (req.isAuthenticated()) {
        // Reset session expiration
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.status(200).json({ success: true, message: 'Session refreshed' });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
});

export default router;
