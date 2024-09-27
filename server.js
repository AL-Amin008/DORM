const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(cors());  // Enable CORS for cross-origin requests

const db = mysql.createConnection({
  host: 'localhost',  // Your MySQL server
  user: 'root',       // Your MySQL username
  password: '1234',       // Your MySQL password (if any)
  database: 'dorm'  // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

app.post('/register', (req, res) => {
  console.log('Received body:', req.body);  // Debugging log

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [name, email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      res.json({ success: true, message: 'User registered successfully.' });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
