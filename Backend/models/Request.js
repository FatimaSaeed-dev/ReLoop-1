const mongoose = require("mongoose");


const RequestSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true
    },


    quantity: {
        type: Number,
        required: true
    },


    location: {
        type: String,
        required: true
    },


    message: {
        type: String
    },


    status: {
        type: String,
        default: "pending"
    },


    userConfirmed: {
        type: Boolean,
        default: false
    },


    businessConfirmed: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
});


module.exports = mongoose.model(
    "Request",
    RequestSchema
);