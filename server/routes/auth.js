const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

const authenticateToken = require("../middleware/auth");

function generateToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(email);

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
        );
        const result = stmt.run(username, email, hashedPassword);

        const token = generateToken(result.lastInsertRowid);

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user.id);

        // Set cookie 
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Logged in successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// Check Login

router.get("/me", authenticateToken, (req, res) => {
  const user = db.prepare(
    "SELECT id, name, email FROM users WHERE id = ?"
  ).get(req.user.userId);

  res.json(user);
});

module.exports = router;