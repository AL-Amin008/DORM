import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2'; // Import RowDataPacket
import bcrypt from 'bcrypt';
import db from '../db'; // Ensure this poin

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Please fill all the fields' });
        return;
    }

    const query = 'SELECT * FROM users WHERE email = ?';

    // Using a promise-based approach for better readability
    db.promise().query<RowDataPacket[]>(query, [email])
        .then(async ([results]) => {
            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare the provided password with the hashed password in the database
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Successful login
            res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
        })
        .catch((err: { message: any; }) => {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
        });
});

export default router;
