const BlogPost = require('../models/BlogModel');
const Admin = require('../models/AdminModel.js');
const Visit = require('../models/VisitorModel.js')
const bcrypt = require("bcryptjs");
const generateTokenSetCookie = require("../utils/generateTokenSetCookie.js");
const crypto = require('crypto');

// const sendEmail = require('../utils/sendEmail');

const home = async (req, res) =>{
    try {
        res.render('admin/index', {
            message: req.flash('message'),
            message_out: req.flash('message_out')
        });
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}

const dashboard = async(req,res) =>{
    try {
         const visits = await Visit.find().sort({ timestamp: -1 }).limit(5);

         const visitCount = await Visit.countDocuments();
         const postCount  = await BlogPost.countDocuments();
        res.render('admin/dashboard' , {visitCount});
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}
const postBlog = async(req,res) =>{
    try {
        res.render('admin/postBlog');
    } catch (error) {
        console.error("Error rendering postBLog:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}

const createPost = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Debugging statement for req.body
        console.log('Uploaded File:', req.file); // Debugging statement for req.file
      // Extract data from the request body
     let { title, author, categories, description, views, comments, postType,  content, tags,  } = req.body;
      const image = req.file ? req.file.path : null; // Handle image upload
  
      // Validate that all required fields are present
      if (!title || !author || !categories || !description || !content || !postType || !tags || !image  ) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
      }

     
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim()); // Split string into an array and trim whitespace
    } else if (!Array.isArray(tags)) {
      tags = []; // Default to an empty array if tags is neither a string nor an array
    }
  
      // Create a new BlogPost document
      const newPost = new BlogPost({
        title,
        author,
        categories,
        content,
        image,
        postType,
        tags,
        description,
      });
  
      // Save the post to the database
      await newPost.save();
  
      // Respond with success message and the newly created post
      res.status(201).json({ message: 'Blog post created successfully', post: newPost });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post', error: error.message });
    }
  };
  const profilePage = async ( req, res) =>{
    try {
        const admins = await Admin.find();
        res.render('admin/profilePage' , { admins});
    } catch (error) {
        console.error("Error rendering profile:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
  }
//  adminLogin
const loginPage = async (req, res)=>{
    try {
        res.render('admin/adminLogin', {
            message: req.flash('message'),
            message_out: req.flash('message_out')
        });
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("An error occurred while loading the home.");
    }
}
const signupPage = async (req, res)=>{
    try {
        res.render('admin/adminSignup' , {message: req.flash('message')});
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("An error occurred while loading the home.");
    }
}



  const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
       
        

        const user = await Admin.findOne({ username });
        console.log(user);
        const isPassword = await bcrypt.compare(password, user?.password || " ");
   
        console.log(password)    
        console.log(isPassword)
        if (!user || !isPassword) {
            req.flash('message', 'Username or password is incorrect!');
            return res.redirect('login-page'); // Add a return to stop further execution
        }
        

        generateTokenSetCookie(user._id, res);
       req.flash('message', 'Login Successfully!');
        res.redirect('home')
    } catch (error) {
        console.log("Error in admin login controller", error.message);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('login-page');
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const adminSignup = async (req, res) => {
    try {
        const { username ,email, password, confirmPassword } = req.body;

            console.log(password)
            console.log(confirmPassword)
        if (password !== confirmPassword) {
            req.flash('message', 'Passwords are not match!');
            return res.redirect('signup-page'); // Add a return to stop further execution
        }

        const user = await Admin.findOne({ username });
        if (user) {
            req.flash('message', 'Username already exit!');
            return res.redirect('signup-page'); // Add a return to stop further execution
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${fullname}`;

        const newUser = new Admin({
            
            username,
            email,
            password: hashedPassword,
           
            profilePic:boyProfilePic ,
        });

        generateTokenSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
       
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const adminLogout = async (req,res)=>{
    try{

        res.cookie("jwt","", {maxAge:0})
        req.flash('message_out', 'Logout Successfully!');
        res.redirect('login-page')

    }catch(error){
        console.log("Error in log out controller",  error.message)
        res.status(500).json({error: "Internal server error"})
    }

}

module.exports = {
    home,
    dashboard,
    postBlog, 
    profilePage,
    createPost,
    signupPage,
    loginPage,
    adminLogin,
    adminSignup,
    adminLogout

}