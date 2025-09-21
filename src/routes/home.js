const express = require('express');
const db = require('../config/database');
const { isAuthorized } = require('../middleware/auth');
const router = express.Router();

// Home page
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
        
        // Get all projects and take first 8 as featured
        const allProjects = userId ? await db.getProjects(userId) : [];
        const featuredProjects = allProjects.slice(0, 8); // First 8 projects as featured
        const skills = userId ? await db.getSkills(userId) : [];
        
        res.render('home', {
            title: 'About Me',
            profileUser: user,
            featuredProjects,
            allProjects,
            skills
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.render('home', {
            title: 'About Me',
            profileUser: null,
            featuredProjects: [],
            allProjects: [],
            skills: []
        });
    }
});

module.exports = router;
