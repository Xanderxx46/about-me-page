const express = require('express');
const db = require('../config/database');
const { isAuthorized } = require('../middleware/auth');
const router = express.Router();

// Projects page
router.get('/', async (req, res) => {
    try {
        // Get the authorized user's data
        const authorizedDiscordId = process.env.AUTHORIZED_DISCORD_ID;
        let user = null;
        let userId = null;
        
        if (authorizedDiscordId) {
            user = await db.getUserByDiscordId(authorizedDiscordId);
            if (user) {
                userId = user.id;
            }
        }
        
        const projects = userId ? await db.getProjects(userId) : [];
        
        res.render('projects', {
            title: 'Projects',
            profileUser: user,
            projects
        });
    } catch (error) {
        console.error('Error loading projects page:', error);
        res.render('projects', {
            title: 'Projects',
            profileUser: null,
            projects: []
        });
    }
});

module.exports = router;
