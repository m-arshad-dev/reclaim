const express = require('express');
const cors = require('cors');   // ✅ add this
const pool = require('./db');
const cors = require("cors")
const app = express();

// Routes
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/authRoutes')

app.use(cors());                 // ✅ add thisapp.use(cors())
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Reclaim.PK Backend Running 🚀');
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database connected successfully',
      time: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});
// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} `, JSON.stringify(req.body, null, 2));
  next();
});

app.use("/api/users", userRoutes);
app.use('api/api/items', itemRoutes);
app.use('api/api/claims', claimRoutes);
app.use("/api/auth" , authRoutes)

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});