require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

const userRoutes = require('./routes/user.routes');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Auth Service Running');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});