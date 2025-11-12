const express = require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Admin login route
router.post("/admin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await User.findOne({ username });
        if (!admin) {
            return res.status(404).send({ message: "Admin not Found!" });
        }

        // Compare hashed password with bcrypt

       {/*} const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password" });
        }
            */}

        // Temporary: plain text comparison (no bcrypt)
const isPasswordValid = password === admin.password;
if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid password" });
}


        // Sign JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Authentication successful",
            token,
            user: {
                username: admin.username,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Failed to Login as Admin", error);
        res.status(500).send({ message: "Failed to Login as Admin" });
    }
});

module.exports = router;
