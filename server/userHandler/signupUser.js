const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

const User = mongoose.model("User", UserSchema);

router.post("/signup", async (req, res) => {
    const { email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).json({ message:"Email already registered."});
        }

        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ message:"User created successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:"Something went wrong."});
    }
});

module.exports = router;