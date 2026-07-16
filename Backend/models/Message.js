const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema(

{

    chat:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Chat",

        required:true

    },


    sender:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    text:{

        type:String,

        required:true,

        trim:true,

        maxlength:1000

    }


},

{

    timestamps:true

}

);



// Faster loading when opening a chat

MessageSchema.index({

    chat:1,

    createdAt:1

});



module.exports =
mongoose.model(
    "Message",
    MessageSchema
);