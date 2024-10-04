import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all overall calculations
router.get('/overall_calculation', (_req: Request, res: Response): void => {
    console.log('GET /overall_calculation endpoint hit');
    const query = `
        SELECT user_id, total_spend, total_meal_count AS total_meal_amount, total_deposit, total_cost, due_or_give
        FROM overall_calculation
    `;

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Overall calculations retrieved successfully', overallCalculations: results });
    });
});

// Endpoint to fetch a specific user's overall calculation by user ID
router.get('/overall_calculation/:user_id', (req: Request, res: Response): void => {
    const { user_id } = req.params;
    const query = `
        SELECT user_id, total_spend, total_meal_count AS total_meal_amount, total_deposit, total_cost, due_or_give
        FROM overall_calculation
        WHERE user_id = ?
    `;

    db.query(query, [user_id], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Overall calculation not found for this user' });
            return;
        }

        res.status(200).json({ message: 'Overall calculation retrieved successfully', overallCalculation: results[0] });
    });
});

// Endpoint to calculate and insert/update overall calculations into the overall_calculation table
router.post('/overall_calculation', (_req: Request, res: Response): void => {
    const query = `
        INSERT INTO overall_calculation (user_id, total_spend, total_meal_count, total_deposit, total_cost, due_or_give)
        SELECT 
            s.user_id,
            SUM(s.price) AS total_spend,
            SUM(m.meal_number) AS total_meal_count,
            SUM(d.amount) AS total_deposit,
            0 AS total_cost, -- Initialize to zero
            0 AS due_or_give -- Initialize to zero
        FROM spend s
        JOIN meal_count m ON s.user_id = m.user_id
        LEFT JOIN deposit d ON s.user_id = d.user_id
        GROUP BY s.user_id
        ON DUPLICATE KEY UPDATE
            total_spend = VALUES(total_spend),
            total_meal_count = VALUES(total_meal_count),
            total_deposit = VALUES(total_deposit),
            total_cost = VALUES(total_cost), -- Update if necessary
            due_or_give = VALUES(due_or_give); -- Update if necessary
    `;

    db.query(query, (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(201).json({ message: 'Overall calculations calculated and inserted/updated successfully', affectedRows: result.affectedRows });
    });
});

export default router;