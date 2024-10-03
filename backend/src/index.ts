import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import registerRouter from './routes/register';
import loginRouter from './routes/login';
import info from './routes/info'; // Ensure the path is correct
import spendRoutes from './routes/spendRoutes';
import mealCount from './routes/mealCount';




const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    // password: 'null', // Uncomment and set if needed
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

// Register the routers for login, registration, and info
app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', info); 
app.use('/api', spendRoutes);// Make sure this line is included
app.use('/api', mealCount);
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error('An error occurred:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
