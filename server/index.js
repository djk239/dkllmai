require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

require('./db');

const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  exposedHeaders: ["X-Conversation-Id"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);


// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/client/dist/index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});