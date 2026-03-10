require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db');

const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');
const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173", 
  exposedHeaders: ["X-Conversation-Id"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));