
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// API Routes

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create and send JWT token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Referrals Routes
app.get('/api/referrals', authenticateToken, async (req, res) => {
  try {
    const referrals = await pool.query('SELECT * FROM referrals ORDER BY created_at DESC');
    res.json(referrals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/referrals', authenticateToken, async (req, res) => {
  try {
    const { 
      referringCompany, clientName, contactPerson, 
      contactEmail, contactPhone, service, status, notes 
    } = req.body;
    
    const newReferral = await pool.query(
      `INSERT INTO referrals 
       (referring_company, client_name, contact_person, contact_email, 
        contact_phone, service, status, notes, created_at, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9) 
       RETURNING *`,
      [referringCompany, clientName, contactPerson, contactEmail, 
       contactPhone, service, status, notes, req.user.id]
    );
    
    res.status(201).json(newReferral.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deals Routes
app.get('/api/deals', authenticateToken, async (req, res) => {
  try {
    const deals = await pool.query('SELECT * FROM deals ORDER BY created_at DESC');
    res.json(deals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/deals', authenticateToken, async (req, res) => {
  try {
    const { 
      title, referralId, value, clientName, stage, expectedCloseDate, description 
    } = req.body;
    
    const newDeal = await pool.query(
      `INSERT INTO deals 
       (title, referral_id, value, client_name, stage, expected_close_date, 
        description, created_at, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) 
       RETURNING *`,
      [title, referralId, value, clientName, stage, expectedCloseDate, 
       description, req.user.id]
    );
    
    res.status(201).json(newDeal.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reports Routes
app.get('/api/reports/referrals', authenticateToken, async (req, res) => {
  try {
    const { sortBy = 'client_name' } = req.query;
    const validColumns = ['client_name', 'referring_company', 'status', 'created_at'];
    
    const orderByColumn = validColumns.includes(sortBy) ? sortBy : 'client_name';
    
    const referrals = await pool.query(
      `SELECT * FROM referrals ORDER BY ${orderByColumn} ASC`
    );
    
    res.json(referrals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/reports/deals', authenticateToken, async (req, res) => {
  try {
    const { sortBy = 'title' } = req.query;
    const validColumns = ['title', 'client_name', 'value', 'stage', 'expected_close_date', 'created_at'];
    
    const orderByColumn = validColumns.includes(sortBy) ? sortBy : 'title';
    const orderType = sortBy === 'value' ? 'DESC' : 'ASC';
    
    const deals = await pool.query(
      `SELECT * FROM deals ORDER BY ${orderByColumn} ${orderType}`
    );
    
    res.json(deals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get referral count
    const referralCountResult = await pool.query('SELECT COUNT(*) FROM referrals');
    const referralCount = parseInt(referralCountResult.rows[0].count);
    
    // Get deal count
    const dealCountResult = await pool.query('SELECT COUNT(*) FROM deals');
    const dealCount = parseInt(dealCountResult.rows[0].count);
    
    // Get total deal value
    const totalValueResult = await pool.query('SELECT SUM(CAST(value AS DECIMAL)) FROM deals');
    const totalDealValue = parseFloat(totalValueResult.rows[0].sum || 0);
    
    // Calculate conversion rate
    const dealsWithReferralsResult = await pool.query(
      'SELECT COUNT(*) FROM deals WHERE referral_id IS NOT NULL'
    );
    const dealsWithReferrals = parseInt(dealsWithReferralsResult.rows[0].count);
    const conversionRate = referralCount > 0 
      ? Math.round((dealsWithReferrals / referralCount) * 100) 
      : 0;
    
    res.json({
      referralCount,
      dealCount,
      totalDealValue,
      conversionRate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
