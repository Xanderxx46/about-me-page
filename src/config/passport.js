import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import db from './database.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in database
        let user = await db.getUserByDiscordId(profile.id);
        
        if (!user) {
            // Create new user
            user = await db.createUser({
                discordId: profile.id,
                username: profile.username,
                displayName: profile.global_name || profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                banner: profile.banner,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } else {
            // Update existing user
            await db.updateUser(user.id, {
                username: profile.username,
                displayName: profile.global_name || profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                banner: profile.banner,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
            user = await db.getUserById(user.id);
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
