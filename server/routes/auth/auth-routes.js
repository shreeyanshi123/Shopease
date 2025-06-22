const express=require("express");
const { registerUser, loginUser, logoutUser, authMiddleware } = require("../../controllers/auth/auth-controller.js");
const router=express.Router();



router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.get("/check-auth",authMiddleware,(req,res)=>{
    let user = req.user;
    // If user is from Passport (Google), fetch full user from DB to get _id
    if (user && !user._id && user.id) {
        // This is a JWT user, already has id as _id
        user = { ...user, _id: user.id };
    }
    // If user is from Passport (Google), ensure _id is present
    if (user && user._id === undefined && user.email) {
        // Try to fetch from DB
        const User = require("../../models/User");
        User.findOne({ email: user.email }).then(dbUser => {
            if (dbUser) {
                user = {
                    ...user,
                    _id: dbUser._id,
                    id: dbUser._id,
                    userName: dbUser.userName,
                    role: dbUser.role,
                };
            }
            res.status(200).json({
                success:true,
                message:"Authenticated user!",
                user,
            });
        }).catch(() => {
            res.status(200).json({
                success:true,
                message:"Authenticated user!",
                user,
            });
        });
        return;
    }
    // Always add id field for frontend
    if (user && user._id) {
        user.id = user._id;
    }
    res.status(200).json({
        success:true,
        message:"Authenticated user!",
        user,
    });
});

module.exports=router;