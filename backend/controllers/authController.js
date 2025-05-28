const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

// Generate JWT Token
const generateToken=(userId)=>{
    return jwt.sign({id: userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser=async (req,res)=>{
    try{
    const {name,email,password,profileImageUrl}=req.body;

    // Check if user already exists
    const userExists=await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    //Hash Password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    // Create new user
    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        profileImageUrl
    });

    //Retuen User data with JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id) // Generate JWT token
        });
}catch(error){
        console.error("Error registering user:", error);
        res.status(500).json({message:"Server error",error:error.message});
    }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser= async (req,res)=>{
    try {
        const {email,password}=req.body;
        // Check if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found or Invalid credentials"});
        }
        // Compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        //Return User data with JWT token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id) // Generate JWT token
        });
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message});
    }
}

// @desc user profile
// @route POST /api/auth/profile
// @access Private(Require JWT)
const getUserProfile= async (req,res)=>{
    try {
        const user=await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message});
    }
}


module.exports={
    registerUser,
    loginUser,
    getUserProfile
};
