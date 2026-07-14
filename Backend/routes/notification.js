const express = require("express");

const router = express.Router();

const Notification =
require("../models/Notification");



// GET USER NOTIFICATIONS

router.get("/:id", async(req,res)=>{


    try{


        const notifications =
        await Notification.find({

            recipient:req.params.id

        })
        .populate(
            "request"
        )
        .sort({
            createdAt:-1
        });



        res.json(notifications);



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});



module.exports = router;