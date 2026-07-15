const express = require("express");

const router = express.Router();

const Message = require("../models/Message");


// SEND MESSAGE

router.post("/", async(req,res)=>{


    try{


        const message = new Message({

            chat:req.body.chat,

            sender:req.body.sender,

            text:req.body.text

        });



        await message.save();



        res.status(201).json({

            message:"Message sent",

            message

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});





// GET CHAT MESSAGES

router.get("/:chatId", async(req,res)=>{


    try{


        const messages = await Message.find({

            chat:req.params.chatId

        })
        .populate(
            "sender",
            "username"
        )
        .sort({

            createdAt:1

        });



        res.json(messages);



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});



module.exports = router;