const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes
app.use('/api', require('./routes/index'));

app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

app.listen(PORT, () => {
  console.log(`🌐 Server listening at http://localhost:${PORT}`);
});
