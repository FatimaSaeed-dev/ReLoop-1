const express = require("express");
const router = express.Router();

const Material = require("../models/Material");

router.post("/", async (req, res) => {

    try {

        const material = new Material(req.body);

        await material.save();

        res.status(201).json({
            message: "Material added successfully",
            material
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.get("/", async (req, res) => {

    try {

        const materials = await Material.find();

        res.json(materials);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
module.exports = router;