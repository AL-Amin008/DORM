import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import registerRouter from './routes/register';
import loginRouter from './routes/login';
import info from './routes/info'; 
import spendRoutes from './routes/spendRoutes';
import mealCount from './routes/mealCount';
import meal_rate from './routes/meal_rate';
import overall_calculation from './routes/overall_calculation';
import deposit from './routes/deposit';




const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
  
    database: 'dorm'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});


app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello World");
});


app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', info); 
app.use('/api', spendRoutes);
app.use('/api', mealCount);
app.use('/api', meal_rate);
app.use('/api', overall_calculation);
app.use('/api', deposit);
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error('An error occurred:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
