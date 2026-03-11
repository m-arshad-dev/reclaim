const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
const morgan = require('morgan')
const pool = require('./db');
const app = express();

const itemRoutes = require('./routes/itemRoutes'); 
const claimRoutes = require('./routes/claimRoutes');
const userRoutes = require('./routes/UserRoutes');
const lostFoundRoutes = require('./routes/itemsroutes')
const authRoutes = require("./routes/authRoutes");

app.use(helmet());
app.use(cors());
app.use(morgan("dev"))
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
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use('/items', itemRoutes);
app.use('/claims', claimRoutes);
app.use("/lostitems",lostFoundRoutes);
app.use("/founditems",lostFoundRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});