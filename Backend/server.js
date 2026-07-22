require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models (for stats)
const User = require("./models/User");
// If your Material model file is named differently or in another path, adjust here:
const Material = require("./models/Material"); 

// Import Routes
const authRoutes = require("./routes/auth");
const materialRoutes = require("./routes/material");
const requestRoutes = require("./routes/request");
const contactRoutes = require("./routes/contactRoutes");
const notificationRoutes = require("./routes/notification");
const messageRoutes = require("./routes/message");

const app = express();

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const PORT = 5000;

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// Live Stats API Route
app.get("/api/stats", async (req, res) => {
    try {
        const bizCount = await User.countDocuments({ role: "business" });
        
        let totalKg = 0;
        let totalItems = 0;

        if (Material) {
            const materials = await Material.find();
            totalItems = materials.length;

            materials.forEach(item => {
                if (item.quantity && !isNaN(item.quantity)) {
                    totalKg += Number(item.quantity);
                }
            });
        }

        res.json({
            biz: bizCount,
            kg: totalKg,
            items: totalItems
        });
    } catch (err) {
        console.error("Stats API Error:", err);
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
});

// Test / Root Routes
app.get("/", (req, res) => {
    res.send("ReLoop Backend is Running!");
});

app.get("/api/test", (req, res) => {
    res.send("API is working");
});

// Database Connection & Server Listener
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log("❌ Database Error:", err);
    });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});