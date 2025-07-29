import express from 'express';
import { userSignup, userLogin, getUsers, deleteUser, updateUser, getUserDetails } from '../controller/user-controller.js';
import passport from 'passport';
import '../config/passportConfig.js';
import multer from 'multer';
import { create_journal, getPostsByUsername, update_journal, delete_journal, getJournalById } from '../controller/journal-controller.js';
import { getAnonymousPosts, createAnonymousPost } from '../controller/anonymous-controller.js';
import { createMood, getMoods } from '../controller/mood-controller.js'; 
import upload from '../multer/multerConfig.js';
import upload1 from '../multer/multerConfig1.js';
import cors from 'cors';
import fetch from 'node-fetch'; // Added for the AI chat route

const router = express.Router();

router.use(cors());

// --- User Routes ---
router.post('/signup', upload.single('profilePicture') ,userSignup);
router.post('/login', userLogin);
router.get('/users', getUsers);
router.get('/:username/getuserdetails', getUserDetails);
router.delete('/delete-user/:username', deleteUser);
router.patch('/:username/update-user', updateUser);

// --- Anonymous Post Routes ---
router.get('/anonymousPosts', getAnonymousPosts);
router.post('/createAnonymousPosts', createAnonymousPost);

// --- Journal Routes ---
router.post ('/:username', upload1.single('coverPicture'), create_journal);
router.get('/:username/journals', getPostsByUsername);
router.put('/journals/:username/:id', update_journal);
router.delete('/journal-delete/:username/:id', delete_journal);
router.get('/:username/:id', getJournalById);

// --- Mood Routes ---
router.get ('/api/moods/:username', getMoods);
router.post ('/api/moods/:username', createMood);


// --- AI Chat Route ---
router.post('/api/aichat', async (req, res) => {
    const { message } = req.body;

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'gemini-pro-ai.p.rapidapi.com'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: message }]
            }]
        })
    };

    try {
        const apiResponse = await fetch('https://gemini-pro-ai.p.rapidapi.com/', options);
        
        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error("Error from RapidAPI:", apiResponse.status, errorBody);
            throw new Error(`RapidAPI request failed with status ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const aiResponseText = data.candidates[0].content.parts[0].text;
            res.status(200).json({ message: aiResponseText });
        } else {
            console.error("Unexpected response structure from RapidAPI:", data);
            throw new Error("Invalid response structure from AI service.");
        }

    } catch (error) {
        console.error("Error in /api/aichat route:", error);
        res.status(500).json({ error: 'Failed to get response from AI service.' });
    }
});


export default router;
