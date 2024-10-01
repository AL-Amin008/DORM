import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all spend records
router.get('/spend', (_req: Request, res: Response): void => {
    console.log('GET /spend endpoint hit');
    const query = 'SELECT * FROM spend';

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Spend records retrieved successfully', spends: results });
    });
});

// Endpoint to fetch a specific spend record by ID
router.get('/spend/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = 'SELECT * FROM spend WHERE id = ?';

    db.query(query, [id], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Spend entry not found' });
            return;
        }

        res.status(200).json({ message: 'Spend entry retrieved successfully', spend: results[0] });
    });
});

// Endpoint to add a new spend entry
router.post('/spend', (req: Request, res: Response): void => {
    const { user_id, spend_date, element, price } = req.body;

    // Check for required fields
    if (!user_id || !spend_date || !element || !price) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    // Check if the user_id exists in the users table
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [user_id], (err, userResults: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        // If the user doesn't exist, return an error
        if (userResults.length === 0) {
            res.status(400).json({ message: 'Invalid user_id, user not found' });
            return;
        }

        // Proceed with inserting the spend record
        const query = `
            INSERT INTO spend (user_id, spend_date, element, price)
            VALUES (?, ?, ?, ?)
        `;

        db.query(query, [user_id, spend_date, element, price], (err, result: ResultSetHeader) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'Database query failed', error: err.message });
                return;
            }
            res.status(201).json({ message: 'Spend entry added successfully', spendId: result.insertId });
        });
    });
});

// Endpoint to update a spend entry
router.put('/spend/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const { user_id, spend_date, element, price } = req.body;

    // Check for required fields
    if (!user_id || !spend_date || !element || !price) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    // Check if the user_id exists in the users table
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [user_id], (err, userResults: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        // If the user doesn't exist, return an error
        if (userResults.length === 0) {
            res.status(400).json({ message: 'Invalid user_id, user not found' });
            return;
        }

        const query = `
            UPDATE spend 
            SET user_id = ?, spend_date = ?, element = ?, price = ?, updated_at = NOW()
            WHERE id = ?
        `;

        db.query(query, [user_id, spend_date, element, price, id], (err, result: ResultSetHeader) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'Database query failed', error: err.message });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Spend entry not found' });
                return;
            }

            res.status(200).json({ message: 'Spend entry updated successfully' });
        });
    });
});

// Endpoint to delete a spend entry
router.delete('/spend/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = 'DELETE FROM spend WHERE id = ?';

    db.query(query, [id], (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Spend entry not found' });
            return;
        }

        res.status(200).json({ message: 'Spend entry deleted successfully' });
    });
});

export default router;
