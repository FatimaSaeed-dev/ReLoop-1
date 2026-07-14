const express = require("express");

const router = express.Router();

const Request = require("../models/Request");

const Notification =
require("../models/Notification");


// CREATE REQUEST

router.post("/", async (req, res) => {

    try {

        const request = new Request({

            user: req.body.user,

            business: req.body.business,

            material: req.body.material,

            quantity: req.body.quantity,

            location: req.body.location,

            message: req.body.message

        });


        await request.save();

        await Notification.create({

    recipient:
    request.business,

    message:
    "New material request received",

    request:
    request._id

});

        res.status(201).json({

            message: "Request sent successfully",

            request

        });


    } catch(error) {


        console.log(error);


        res.status(500).json({

            message: error.message

        });


    }

});



// GET ALL REQUESTS FOR BUSINESS

router.get("/business/:id", async (req,res)=>{


    try{


        const requests = await Request.find({

            business:req.params.id

        })

        .populate("user","username email")

        .populate("material","name quantity images");



        res.json(requests);


    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});



// GET USER REQUESTS

router.get("/user/:id", async(req,res)=>{


    try{


        const requests = await Request.find({

            user:req.params.id

        })

        .populate("material","name images")

        .populate("business","username");



        res.json(requests);


    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});

// ACCEPT REQUEST

router.put("/:id/accept", async(req,res)=>{


    try{


        const request =
        await Request.findByIdAndUpdate(

            req.params.id,

            {
                status:"accepted"
            },

            {
                new:true
            }

        );



        res.json({

            message:"Request accepted",

            request

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});




// REJECT REQUEST

router.put("/:id/reject", async(req,res)=>{


    try{


        const request =
        await Request.findByIdAndUpdate(

            req.params.id,

            {
                status:"rejected"
            },

            {
                new:true
            }

        );



        res.json({

            message:"Request rejected",

            request

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});

module.exports = router;