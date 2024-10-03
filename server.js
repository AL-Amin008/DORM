const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cors());          // Enable CORS for cross-origin requests

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',  // MySQL server
  user: 'root',       // MySQL username
  // password: '1234',   // MySQL password
  database: 'dorm' // Database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

// Route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('Welcome to the DORM API! Use /register to create a new user.');
});

// Route for GET /register (to show a simple message or form)
app.get('/register', (req, res) => {
  res.send(`
    <h2>Register a New User</h2>
    <form action="/register" method="POST">
      <label>Name: <input type="text" name="name" /></label><br/>
      <label>Email: <input type="email" name="email" /></label><br/>
      <label>Password: <input type="password" name="password" /></label><br/>
      <button type="submit">Register</button>
    </form>
  `);
});

// Route for POST /register (to handle user registration)
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Check if the email is already in use
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [name, email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      res.json({ success: true, message: 'User registered successfully.' });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
