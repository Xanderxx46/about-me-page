import express from 'express';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import passport from 'passport';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import homeRoutes from './routes/home.js';
import projectRoutes from './routes/projects.js';
import adminRoutes from './routes/admin.js';

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration with SQLite store
app.use(session({
    store: new (SQLiteStore(session))({
        db: 'sessions.sqlite',
        dir: dataDir,
        table: 'sessions'
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true, // Save session even if not modified
    saveUninitialized: false,
    rolling: true, // Reset expiration on every request
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true // Prevent XSS attacks
    }
}));

// Passport configuration
import './config/passport.js';
app.use(passport.initialize());
app.use(passport.session());

// IP authorization middleware
import { isAuthorizedIP } from './middleware/ipAuth.js';
app.use(isAuthorizedIP);

// Make user and authorization status available in all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthorized = req.isAuthenticated() && 
        req.user && 
        req.user.discord_id === process.env.AUTHORIZED_DISCORD_ID;
    res.locals.isAuthorizedIP = req.isAuthorizedIP;
    
    // Make current URL available for Open Graph tags
    res.locals.currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    
    // Auto-refresh session for authenticated users
    if (req.isAuthenticated() && req.session) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Reset to 30 days
    }
    
    next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/admin', adminRoutes);

// Legal pages
app.get('/terms', (req, res) => {
    res.render('terms', { title: 'Terms of Service' });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Server Error',
        error: err.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
