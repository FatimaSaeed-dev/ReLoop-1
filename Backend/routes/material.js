console.log("Material route loaded");

const express = require("express");
const router = express.Router();

const Material = require("../models/Material");
const upload = require("../middleware/upload");

router.post("/", upload.array("images", 5), async (req, res) => {

    try {

        const imageUrls = req.files.map(file => file.path);


        const material = new Material({

            name: req.body.name,

            category: req.body.category,

            quantity: req.body.quantity,

            pricePerKg: req.body.pricePerKg,

            location: req.body.location,

            description: req.body.description,

            images: imageUrls,

            owner: req.body.owner

        });


        await material.save();


        res.status(201).json({

            message: "Material added successfully",

            material

        });


    } catch(error){

        console.log(error);

        res.status(500).json({

            message:error.message

        });

    }

});

router.get("/", async (req, res) => {

    try {

        const materials = await Material.find()
            .populate("owner", "username");


        res.json(materials);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

router.get("/owner/:ownerId", async (req, res) => {

    try {

        const materials = await Material.find({
            owner: req.params.ownerId
        });

        res.json(materials);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.delete("/:id", async (req, res) => {

    try {

        const deletedMaterial = await Material.findByIdAndDelete(
            req.params.id
        );


        if(!deletedMaterial){

            return res.status(404).json({
                message:"Material not found"
            });

        }


        res.json({

            message:"Material deleted successfully",

            deletedMaterial

        });


    } catch(error){

        console.log(error);

        res.status(500).json({

            message:error.message

        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );


        if(!updatedMaterial){

            return res.status(404).json({
                message:"Material not found"
            });

        }


        res.json({

            message:"Material updated successfully",

            material: updatedMaterial

        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

router.get("/test", (req,res)=>{
    res.send("Material route works");
});


router.get("/:id", async (req, res) => {

    try {

        const material = await Material.findById(req.params.id)
            .populate("owner", "username");


        if (!material) {

            return res.status(404).json({
                message: "Material not found"
            });

        }


        res.json(material);


    } catch(error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;