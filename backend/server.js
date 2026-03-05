const express = require('express');
const pool = require('./db');
const app = express();

const itemRoutes = require('./routes/itemRoutes'); 

app.use(express.json());

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

app.use('/items', itemRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});