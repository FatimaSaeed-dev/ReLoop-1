const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Material = require("../models/Material"); // Ensure path matches your Material model

router.get("/", async (req, res) => {
    try {
        // Count businesses registered in DB
        const bizCount = await User.countDocuments({ role: "business" });

        // Aggregate total waste quantity (kg) and total listings count
        const materials = await Material.find();
        
        let totalKg = 0;
        let totalItems = materials.length;

        materials.forEach(item => {
            // Adjust field name (e.g., item.quantity or item.weight) if your schema uses a different name
            if (item.quantity && !isNaN(item.quantity)) {
                totalKg += Number(item.quantity);
            }
        });

        res.json({
            biz: bizCount,
            kg: totalKg,
            items: totalItems
        });
    } catch (err) {
        console.error("Stats API Error:", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

module.exports = router;