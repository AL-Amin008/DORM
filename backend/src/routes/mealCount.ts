import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Endpoint to fetch all meal count records with user name and entry_at
router.get('/meal', (_req: Request, res: Response): void => {
    const query = `
        SELECT meal_count.id, meal_count.meal_time, meal_count.meal_date, meal_count.meal_number, 
               meal_count.entry_at, users.name AS user_name
        FROM meal_count
        JOIN users ON meal_count.user_id = users.id
    `;

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Meal records retrieved successfully', meals: results });
    });
});

// Endpoint to fetch a specific meal count record by ID with user name and entry_at
router.get('/meal/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = `
        SELECT meal_count.id, meal_count.meal_time, meal_count.meal_date, meal_count.meal_number, 
               meal_count.entry_at, users.name AS user_name
        FROM meal_count
        JOIN users ON meal_count.user_id = users.id
        WHERE meal_count.id = ?
    `;

    db.query(query, [id], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Meal entry not found' });
            return;
        }

        res.status(200).json({ message: 'Meal entry retrieved successfully', meal: results[0] });
    });
});

// Endpoint to add a new meal entry
router.post('/meal', (req: Request, res: Response): void => {
    const { user_id, meal_time, meal_date, meal_number } = req.body;

    // Check for required fields
    if (!user_id || !meal_time || !meal_date || !meal_number) {
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

        // Proceed with inserting the meal record
        const query = `
            INSERT INTO meal_count (user_id, meal_time, meal_date, meal_number, entry_at)
            VALUES (?, ?, ?, ?, NOW())
        `;

        db.query(query, [user_id, meal_time, meal_date, meal_number], (err, result: ResultSetHeader) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'Database query failed', error: err.message });
                return;
            }

            // Fetch the inserted meal record along with the user's name
            const fetchMealQuery = `
                SELECT meal_count.id, meal_count.meal_time, meal_count.meal_date, meal_count.meal_number, 
                       meal_count.entry_at, users.name AS user_name
                FROM meal_count
                JOIN users ON meal_count.user_id = users.id
                WHERE meal_count.id = ?
            `;

            db.query(fetchMealQuery, [result.insertId], (err, fetchedMeal: RowDataPacket[]) => {
                if (err) {
                    console.error('Error fetching meal:', err);
                    res.status(500).json({ message: 'Failed to fetch added meal', error: err.message });
                    return;
                }

                res.status(201).json({ message: 'Meal entry added successfully', meal: fetchedMeal[0] });
            });
        });
    });
});

// Endpoint to update a meal entry
router.put('/meal/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const { user_id, meal_time, meal_date, meal_number } = req.body;

    // Check for required fields
    if (!user_id || !meal_time || !meal_date || !meal_number) {
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
            UPDATE meal_count 
            SET user_id = ?, meal_time = ?, meal_date = ?, meal_number = ?, updated_at = NOW()
            WHERE id = ?
        `;

        db.query(query, [user_id, meal_time, meal_date, meal_number, id], (err, result: ResultSetHeader) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'Database query failed', error: err.message });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Meal entry not found' });
                return;
            }

            res.status(200).json({ message: 'Meal entry updated successfully' });
        });
    });
});

// Endpoint to delete a meal entry
router.delete('/meal/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = 'DELETE FROM meal_count WHERE id = ?';

    db.query(query, [id], (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Meal entry not found' });
            return;
        }

        res.status(200).json({ message: 'Meal entry deleted successfully' });
    });
});

export default router;
