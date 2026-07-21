const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary");


const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: "reloop_materials",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ]

    }

});


module.exports = storage;