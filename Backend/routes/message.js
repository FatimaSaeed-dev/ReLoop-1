const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Message = require("../models/Message");
const Chat = require("../models/Chat");



// ===============================
// SEND MESSAGE
// ===============================

router.post("/", async(req,res)=>{

    try{


        const {
            chat,
            sender,
            text
        } = req.body;



        if(!chat || !sender || !text){

            return res.status(400).json({

                message:"Chat, sender and text are required"

            });

        }



        if(!mongoose.Types.ObjectId.isValid(chat)){

            return res.status(400).json({

                message:"Invalid chat ID"

            });

        }



        const existingChat =
        await Chat.findById(chat);



        if(!existingChat){

            return res.status(404).json({

                message:"Chat not found"

            });

        }



        const message = new Message({

            chat,

            sender,

            text:text.trim()

        });



        await message.save();



        const populatedMessage =
        await Message.findById(message._id)
        .populate(
            "sender",
            "username"
        );



        res.status(201).json({

            message:"Message sent",

            data:populatedMessage

        });



    }
    catch(error){


        console.log("SEND MESSAGE ERROR:",error);


        res.status(500).json({

            message:error.message

        });


    }


});







// ===============================
// GET USER CHATS
// IMPORTANT: KEEP ABOVE /:chatId
// ===============================


router.get("/user/:id", async(req,res)=>{


    try{


        const userId = req.params.id;



        if(!mongoose.Types.ObjectId.isValid(userId)){

            return res.status(400).json({

                message:"Invalid user ID"

            });

        }




        const chats =
        await Chat.find({

            participants:userId

        })
        .populate(
            "participants",
            "username"
        )
        .populate(
            "request"
        )
        .sort({

            updatedAt:-1

        });



        res.json(chats);



    }
    catch(error){


        console.log("GET USER CHATS ERROR:",error);


        res.status(500).json({

            message:error.message

        });


    }


});








// ===============================
// GET CHAT MESSAGES
// ===============================


router.get("/:chatId", async(req,res)=>{


    try{


        const chatId =
        req.params.chatId;



        if(!mongoose.Types.ObjectId.isValid(chatId)){


            return res.status(400).json({

                message:"Invalid chat ID"

            });


        }




        const messages =
        await Message.find({

            chat:chatId

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


        console.log("GET MESSAGES ERROR:",error);


        res.status(500).json({

            message:error.message

        });


    }


});





module.exports = router;