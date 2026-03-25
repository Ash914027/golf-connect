const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Protected route example
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Role-based protected route
app.get('/api/admin-only', require('./middleware/auth'), require('./middleware/role')(['admin']), (req, res) => {
  res.json({ message: 'This is admin only' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});