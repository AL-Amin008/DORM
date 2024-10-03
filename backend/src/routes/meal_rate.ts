import express, { Request, Response } from 'express';
import db from '../db'; // Ensure this points to your db connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt'; // for password hashing

const router = express.Router();

// Fetch all users
router.get('/users', (_req: Request, res: Response): void => {
    const query = `SELECT id, name, email, created_at, is_admin FROM users`;

    db.query(query, (err, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.status(200).json({ message: 'Users retrieved successfully', users: results });
    });
});

// Fetch a specific user by id
router.get('/users/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = `SELECT id, name, email, created_at, is_admin FROM users WHERE id = ?`;

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

        res.status(200).json({ message: 'User retrieved successfully', user: results[0] });
    });
});

// Insert a new user (with hashed password)
router.post('/users', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, is_admin } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Missing required fields: name, email, password' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // hash the password
        const query = `INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)`;

        db.query(query, [name, email, hashedPassword, is_admin || 0], (err, result: ResultSetHeader) => {
            if (err) {
                console.error('Error executing query:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ message: 'Email already exists' });
                } else {
                    res.status(500).json({ message: 'Database query failed', error: err.message });
                }
                return;
            }
            res.status(201).json({ message: 'User created successfully', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Update a user's information
router.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, password, is_admin } = req.body;

    let updateQuery = `UPDATE users SET `;
    const updateFields: any[] = [];

    if (name) {
        updateQuery += `name = ?, `;
        updateFields.push(name);
    }
    if (email) {
        updateQuery += `email = ?, `;
        updateFields.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery += `password = ?, `;
        updateFields.push(hashedPassword);
    }
    if (is_admin !== undefined) {
        updateQuery += `is_admin = ?, `;
        updateFields.push(is_admin);
    }

    // Remove the trailing comma and add the WHERE clause
    updateQuery = updateQuery.slice(0, -2) + ` WHERE id = ?`;
    updateFields.push(id);

    db.query(updateQuery, updateFields, (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete a user
router.delete('/users/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const query = `DELETE FROM users WHERE id = ?`;

    db.query(query, [id], (err, result: ResultSetHeader) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

export default router;
