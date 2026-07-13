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

router.get("/profile", authMiddleware, (req, res) => {

    res.json({
        message: "You can access your profile",
        user: req.user
    });

});
module.exports=router;