const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const User = require("../models/User.js");

const router=express.Router();

router.post("/register", async (req, res) => {

    try {

        const { username, email, password, role } = req.body;
        const existingUsername = await User.findOne({ username });

const existingEmail = await User.findOne({ email });

if (existingEmail) {
    return res.status(400).json({
        message: "Email already exists."
    });
}

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hash,
            role
        });

        await user.save();

        res.json({
            message: "Registered"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            message: error.message
        });

    }

});

router.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const match=await bcrypt.compare(password,user.password);

    if(!match){
        return res.status(400).json({message:"Wrong password"});
    }

    const token=jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET
    );

res.json({
    token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
});

});

router.get("/profile", authMiddleware, async (req, res) => {

    try{

        const user = await User.findById(req.user.id).select("-password");

        if(!user){

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user);

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

router.put(
    "/profile",
    authMiddleware,
    upload.single("profileImage"),
    async (req, res) => {

        try{

            const updateData = {

                username: req.body.username,
                email: req.body.email

            };

            if(req.file){

                updateData.profileImage = req.file.path;

            }

            const updatedUser = await User.findByIdAndUpdate(

                req.user.id,

                updateData,

                { new: true }

            ).select("-password");

            res.json({

                message: "Profile updated successfully",

                user: updatedUser

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);
module.exports=router;