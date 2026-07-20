const express = require("express");

const router = express.Router();

const Notification =
require("../models/Notification");


router.get("/:id", async(req,res)=>{


try{


const notifications =
await Notification.find({

recipient:req.params.id

})

.populate("request")

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

router.put("/:id/read", async(req,res)=>{

    try{

        const notification =
        await Notification.findByIdAndUpdate(

            req.params.id,

            {
                read:true
            },

            {
                new:true
            }

        );

        if(!notification){

            return res.status(404).json({

                message:"Notification not found"

            });

        }

        res.json(notification);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});

module.exports = router;