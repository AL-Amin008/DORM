import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2';
import db from '../db'; // Ensure this points to your db connection

const router = express.Router();

// Endpoint to fetch all meals
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

// Endpoint to fetch a specific meal by ID
router.get('/meals/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const query = 'SELECT * FROM meals WHERE id = ?';

    try {
        const [results] = await db.promise().query<RowDataPacket[]>(query, [id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Meal not found' });
            return;
        }

        const meal = results[0];
        res.status(200).json({ message: 'Meal retrieved successfully', meal });
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

// Endpoint to add a new meal
router.post('/meals', async (req: Request, res: Response): Promise<void> => {
    const { meal_name, description, meal_time, meal_date } = req.body;

    // Basic validation
    if (!meal_name || !description || !meal_time || !meal_date) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const query = `
        INSERT INTO meals (meal_name, description, meal_time, meal_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, current_timestamp(), current_timestamp())
    `;

    try {
        const [result] = await db.promise().query(query, [meal_name, description, meal_time, meal_date]);
        res.status(201).json({ message: 'Meal added successfully', mealId: (result as any).insertId });
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

// Endpoint to update a meal
router.put('/meals/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { meal_name, description, meal_time, meal_date } = req.body;

    // Basic validation
    if (!meal_name || !description || !meal_time || !meal_date) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const query = `
        UPDATE meals 
        SET meal_name = ?, description = ?, meal_time = ?, meal_date = ?, updated_at = current_timestamp() 
        WHERE id = ?
    `;

    try {
        const [result] = await db.promise().query(query, [meal_name, description, meal_time, meal_date, id]);
        if ((result as any).affectedRows === 0) {
            res.status(404).json({ message: 'Meal not found' });
            return;
        }

        res.status(200).json({ message: 'Meal updated successfully' });
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

// Endpoint to delete a meal
router.delete('/meals/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const query = 'DELETE FROM meals WHERE id = ?';

    try {
        const [result] = await db.promise().query(query, [id]);
        if ((result as any).affectedRows === 0) {
            res.status(404).json({ message: 'Meal not found' });
            return;
        }

        res.status(200).json({ message: 'Meal deleted successfully' });
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
