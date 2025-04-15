const express = require('express');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const User = require('../models/userModel');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.ACCESS_TOKEN_SECRET,                         
            { expiresIn: '1h' }                  
        );

        res.json({ message: "Login successful", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
