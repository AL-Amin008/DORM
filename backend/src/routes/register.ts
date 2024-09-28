import { Router, Request, Response } from 'express';
import db from '../db'; // Make sure this import is correct

const router = Router();

// Route to handle user registration
router.post('/register', (req: any, res: any) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    // Insert user into the database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to register user.' });
        }
        
        // Return success response with user ID
       
    });
});

export default router;
