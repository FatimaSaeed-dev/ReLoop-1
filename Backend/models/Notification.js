const mongoose = require("mongoose");


const NotificationSchema = new mongoose.Schema({

    recipient: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    message: {

        type:String,

        required:true

    },


    request: {

        type: mongoose.Schema.Types.ObjectId,

        ref:"Request"

    },


    read: {

        type:Boolean,

        default:false

    }


},
{
    timestamps:true
});


module.exports =
mongoose.model(
    "Notification",
    NotificationSchema
);