import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all deposit records
router.get('/deposit', (_req: Request, res: Response): void => {
    console.log('GET /deposit endpoint hit');
    const query = `
        SELECT deposit.id, users.name, deposit.amount, deposit.deposit_date
        FROM deposit
        JOIN users ON deposit.user_id = users.id
    `;

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Deposit records retrieved successfully', deposits: results });
    });
});

// Endpoint to add a new deposit entry
router.post('/deposit', (req: Request, res: Response): void => {
    const { user_id, deposit_date, amount } = req.body;

    // Check for required fields
    if (!user_id || !deposit_date || !amount) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const query = `
        INSERT INTO deposit (user_id, deposit_date, amount)
        VALUES (?, ?, ?)
    `;

    db.query(query, [user_id, deposit_date, amount], (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(201).json({ message: 'Deposit entry added successfully', depositId: result.insertId });
    });
});

// Add similar routes for updating and deleting deposits if needed

export default router;