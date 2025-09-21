import express from 'express';
import db from '../config/database.js';
import { isAuthorized } from '../middleware/auth.js';
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
        
        // Get all projects and featured projects
        const allProjects = userId ? await db.getProjects(userId) : [];
        const featuredProjects = userId ? await db.getProjects(userId, true) : []; // Only featured projects
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

export default router;
