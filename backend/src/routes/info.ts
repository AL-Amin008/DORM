import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2';
import db from '../db'; // Ensure this points to your db connection

const router = express.Router();

// Endpoint to fetch user personal information
router.get('/personal_info/:userId', async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const query = 'SELECT * FROM personal_info WHERE user_id = ?';

    try {
        const [results] = await db.promise().query<RowDataPacket[]>(query, [userId]);
        if (results.length === 0) {
            res.status(404).json({ message: 'No personal info found for this user' });
            return;
        }

        const personalInfo = results[0];
        res.status(200).json({ message: 'Personal info retrieved successfully', personalInfo });
    } catch (err) {
        // Type-safe error handling
        if (err instanceof Error) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ message: 'Database query failed', error: err.message });
        } else {
            console.error('Unknown error:', err);
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// Endpoint to fetch meal details
router.get('/meals', async (_req: Request, res: Response): Promise<void> => {
    const query = 'SELECT * FROM meals';

    try {
        const [results] = await db.promise().query<RowDataPacket[]>(query);
        res.status(200).json({ message: 'Meals retrieved successfully', meals: results });
    } catch (err) {
        // Type-safe error handling
        if (err instanceof Error) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ message: 'Database query failed', error: err.message });
        } else {
            console.error('Unknown error:', err);
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// Export the router
export default router;
