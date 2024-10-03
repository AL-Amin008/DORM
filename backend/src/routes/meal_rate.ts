import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all meal rates
router.get('/meal_rate', (_req: Request, res: Response): void => {
    console.log('GET /meal_rate endpoint hit');
    const query = `
        SELECT user_id, total_spend, total_meal_count, meal_rate
        FROM meal_rate
    `;

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Meal rates retrieved successfully', mealRates: results });
    });
});

// Endpoint to fetch a specific user's meal rate by user ID
router.get('/meal_rate/:user_id', (req: Request, res: Response): void => {
    const { user_id } = req.params;
    const query = `
        SELECT user_id, total_spend, total_meal_count, meal_rate
        FROM meal_rate
        WHERE user_id = ?
    `;

    db.query(query, [user_id], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Meal rate not found for this user' });
            return;
        }

        res.status(200).json({ message: 'Meal rate retrieved successfully', mealRate: results[0] });
    });
});

// Endpoint to calculate and insert/update meal rates into the meal_rate table
router.post('/meal_rate', (_req: Request, res: Response): void => {
    const query = `
        INSERT INTO meal_rate (user_id, total_spend, total_meal_count, meal_rate)
        SELECT 
            s.user_id,
            SUM(s.price) AS total_spend,
            SUM(m.meal_number) AS total_meal_count,
            CASE 
                WHEN SUM(m.meal_number) > 0 THEN SUM(s.price) / SUM(m.meal_number)
                ELSE 0
            END AS meal_rate
        FROM spend s
        JOIN mealcount m ON s.user_id = m.user_id
        GROUP BY s.user_id
        ON DUPLICATE KEY UPDATE
            total_spend = VALUES(total_spend),
            total_meal_count = VALUES(total_meal_count),
            meal_rate = VALUES(meal_rate),
            calculated_at = CURRENT_TIMESTAMP;
    `;

    db.query(query, (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(201).json({ message: 'Meal rates calculated and inserted/updated successfully', affectedRows: result.affectedRows });
    });
});

export default router;