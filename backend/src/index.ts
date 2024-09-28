import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';


const app = express();
app.use(cors());
const port = process.env.PORT || 3000;


const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    // password: 'null', 
    database: 'dorm'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

// Define a simple route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello World");
});

// Add a new route to interact with the database
app.get('/students', (req: Request, res: Response) => {
    const query = 'SELECT * FROM students'; // Adjust the query as per your table structure
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
        } else {
            res.status(200).json(results); // Send the results as JSON
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
