require("dotenv").config();

console.log("ENV =", process.env.MONGO_URI);

const authRoutes = require("./routes/auth");
const materialRoutes = require("./routes/material");

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
const PORT = 5000;

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

app.get("/", (req, res) => {
    res.send("ReLoop Backend is Running!");
});
app.get("/api/test", (req,res)=>{
    res.send("API is working");
});

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
