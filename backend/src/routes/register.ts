import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    database: 'dorm'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL for register as ID ' + db.threadId);
});

// Register route
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please fill all the fields' });
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare SQL query
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        // Insert into MySQL database
        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error executing query:', err); // Detailed error in the console
                return res.status(500).json({ message: 'Registration failed', error: err.message }); // Send detailed error in response
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Error in registration process:', error); // Log any error in the hashing process or logic
        // res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
