const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    pricePerKg: {
        type: Number,
        required: true
    },

    location: {
        type: String
    },

    description: {
        type: String
    },

    image: {
        type: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

module.exports = mongoose.model("Material", MaterialSchema);