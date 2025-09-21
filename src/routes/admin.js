import express from 'express';
import db from '../config/database.js';
import { isAuthenticated, isAuthorized } from '../middleware/auth.js';
const router = express.Router();

// Admin dashboard
router.get('/', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await db.getProjects(userId);
        const skills = await db.getSkills(userId);
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            projects,
            skills
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            projects: [],
            skills: []
        });
    }
});

// About me editing
router.get('/about', isAuthenticated, isAuthorized, (req, res) => {
    res.render('admin/about', {
        title: 'Edit About Me'
    });
});

router.post('/about', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const { aboutMe } = req.body;
        await db.updateUser(req.user.id, { about_me: aboutMe });
        res.redirect('/admin?success=about-updated');
    } catch (error) {
        console.error('Error updating about me:', error);
        res.redirect('/admin/about?error=update-failed');
    }
});

// Project management
router.get('/projects/new', isAuthenticated, isAuthorized, (req, res) => {
    res.render('admin/project-form', {
        title: 'Add New Project',
        project: null
    });
});

router.post('/projects', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const { title, description, imageUrl, projectUrl, githubUrl, technologies, featured } = req.body;
        
        await db.createProject({
            userId: req.user.id,
            title,
            description,
            image_url: imageUrl,
            project_url: projectUrl,
            github_url: githubUrl,
            technologies,
            featured: featured === 'on'
        });
        
        res.redirect('/admin?success=project-added');
    } catch (error) {
        console.error('Error creating project:', error);
        res.redirect('/admin/projects/new?error=create-failed');
    }
});

router.get('/projects/:id/edit', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const project = await db.getProjectById(req.params.id);
        if (!project || project.user_id !== req.user.id) {
            return res.status(404).render('error', { 
                title: 'Project Not Found',
                error: 'Project not found' 
            });
        }
        
        res.render('admin/project-form', {
            title: 'Edit Project',
            project
        });
    } catch (error) {
        console.error('Error loading project for edit:', error);
        res.redirect('/admin?error=project-not-found');
    }
});

router.post('/projects/:id', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const { title, description, imageUrl, projectUrl, githubUrl, technologies, featured } = req.body;
        
        await db.updateProject(req.params.id, {
            title,
            description,
            image_url: imageUrl,
            project_url: projectUrl,
            github_url: githubUrl,
            technologies,
            featured: featured === 'on'
        });
        
        res.redirect('/admin?success=project-updated');
    } catch (error) {
        console.error('Error updating project:', error);
        res.redirect(`/admin/projects/${req.params.id}/edit?error=update-failed`);
    }
});

router.post('/projects/:id/delete', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        await db.deleteProject(req.params.id);
        res.redirect('/admin?success=project-deleted');
    } catch (error) {
        console.error('Error deleting project:', error);
        res.redirect('/admin?error=delete-failed');
    }
});

// Skills management
router.get('/skills/new', isAuthenticated, isAuthorized, (req, res) => {
    res.render('admin/skill-form', {
        title: 'Add New Skill',
        skill: null
    });
});

router.post('/skills', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const { name, level, category, imageUrl, url } = req.body;
        
        await db.createSkill({
            userId: req.user.id,
            name,
            level,
            category,
            imageUrl,
            url
        });
        
        res.redirect('/admin?success=skill-added');
    } catch (error) {
        console.error('Error creating skill:', error);
        res.redirect('/admin/skills/new?error=create-failed');
    }
});

router.get('/skills/:id/edit', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const skill = await db.getSkillById(req.params.id);
        if (!skill || skill.user_id !== req.user.id) {
            return res.status(404).render('error', { 
                title: 'Skill Not Found',
                error: 'Skill not found' 
            });
        }
        
        res.render('admin/skill-form', {
            title: 'Edit Skill',
            skill
        });
    } catch (error) {
        console.error('Error loading skill for edit:', error);
        res.redirect('/admin?error=skill-not-found');
    }
});

router.post('/skills/:id', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const { name, level, category, imageUrl, url } = req.body;
        
        await db.updateSkill(req.params.id, {
            name,
            level,
            category,
            imageUrl,
            url
        });
        
        res.redirect('/admin?success=skill-updated');
    } catch (error) {
        console.error('Error updating skill:', error);
        res.redirect(`/admin/skills/${req.params.id}/edit?error=update-failed`);
    }
});

router.post('/skills/:id/delete', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        await db.deleteSkill(req.params.id);
        res.redirect('/admin?success=skill-deleted');
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.redirect('/admin?error=delete-failed');
    }
});

export default router;
