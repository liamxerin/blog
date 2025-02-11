const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');
const protectRoute = async (req, res, next) =>{

    try{

        const token =  req.cookies.jwt;
        if(!token){
            // return res.status(401).json({
            //     error: "Unauthorized - No token Provided"
                
            // })
            return res.redirect('login-page');

            


        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(404).json({
                error: "Unauthorized - Invalid Token"
            })
        }

        const user = await Admin.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({
                error: "Unauthorized - User not found"
            })
        }

        req.user = user //<--- currently authenticated user

        next();
    }catch(error){

        console.log("Error in protectedRoute middleware:", error.message)
        res.status(500).json({error: "Opps! , Internal server error"})

    }

}

module.exports = protectRoute;