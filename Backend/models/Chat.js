const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema(

{

    request: {

        type: mongoose.Schema.Types.ObjectId,

        ref:"Request",

        required:true,

        unique:true

    },


    participants:[

        {

            type:mongoose.Schema.Types.ObjectId,

            ref:"User",

            required:true

        }

    ]


},

{

    timestamps:true

}

);



// Make sure a chat always has two people
ChatSchema.path("participants").validate(

    function(value){

        return value.length === 2;

    },

    "A chat must have exactly two participants"

);



// Faster searching for user chats

ChatSchema.index({

    participants:1

});



module.exports =
mongoose.model(
    "Chat",
    ChatSchema
);