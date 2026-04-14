const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const seed = require("./seed");

// Routes
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRouter');
const categoryRoutes = require('./routes/categoryRoutes');

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Reclaim.PK Backend Running 🚀');
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully', time: result.rows[0] });
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

app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Run seed if --seed flag passed
  // Usage: node app.js --seed
  if (process.argv.includes("--seed")) {
    await seed();
    console.log("✅ Seeding complete");
    process.exit(0);
  }
});