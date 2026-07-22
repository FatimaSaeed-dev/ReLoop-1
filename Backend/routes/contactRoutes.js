const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// TEST GET ROUTE (This fixes "Cannot GET /api/contact")
router.get("/", async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST ROUTE (Saves form data to MongoDB)
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        res.status(201).json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error saving message." });
    }
});

module.exports = router;