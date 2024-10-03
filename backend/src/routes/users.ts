import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all users
router.get('/users', (req: Request, res: Response): void => {
    console.log('GET /api/users endpoint hit');
    const query = 'SELECT id AS user_id, name, email, created_at FROM users'; // Adjusted column names

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'User records retrieved successfully', users: results });
    });
});

// Endpoint to fetch a specific user by ID
router.get('/users/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = 'SELECT id AS user_id, name, email, created_at FROM users WHERE id = ?'; // Adjusted column names

    db.query(query, [id], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User record retrieved successfully', user: results[0] });
    });
});

export default router;