const express = require('express');
const connectDB = require('./config/db');
const analyticsRoutes = require('./routes/analytics');

require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('E-Commerce Sales Analytics API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
