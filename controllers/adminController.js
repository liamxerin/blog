const BlogPost = require('../models/BlogModel');
const Admin = require('../models/AdminModel.js');
const Visit = require('../models/VisitorModel.js')
const Message = require('../models/MessageModel.js')
const bcrypt = require("bcryptjs");
const generateTokenSetCookie = require("../utils/generateTokenSetCookie.js");
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')
// const sendEmail = require('../utils/sendEmail');

const home = async (req, res) =>{
    try {
        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        res.render('admin/index', {
            draftCount,
            message: req.flash('message'),
            message_out: req.flash('message_out')
        });
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}
const getAllBlogs = async (req , res) =>{
    try{

        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const blogs = await BlogPost.find({ status: "published" });
        const postsWithComments = blogs.map(blog => ({
            ...blog.toObject(),
            totalComments: blog.comments.length,
        }));

        res.render( 'admin/blogs', {
            message : req.flash('message'),
            blogs : postsWithComments,
             draftCount
        });

    }catch(error){
        console.error("Error rendering blog page:", error);
        res.status(500).send("An error occurred while loading the blog page.");
    }
}

 
 const getAllDraft = async (req, res)=>{
    try{

        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const drafts = await BlogPost.find({ status: "draft" });

        res.render( 'admin/drafts', {
            message : req.flash('message'),
            drafts 
            , draftCount
        });

    }catch(error){
        console.error("Error rendering draft page:", error);
        res.status(500).send("An error occurred while loading the draft page.");
    }
}
const updatePage = async (req, res) =>{
    try{
        const { id } = req.params;
        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const blog = await BlogPost.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'No such blog' });
        }
        res.render( 'admin/updatePage', { message: req.flash('message') , blog , draftCount});

    }catch(error){
        console.error("Error rendering blog page:", error);
        res.status(500).send("An error occurred while loading the blog page.");
    }
}


const updateBlog = async (req, res) => {
    try {
        const { id } = req.params; // Get the blog post ID from the URL
        const { title, author, categories, description, content, tags, status, postType } = req.body;
        
        // Default to existing image or handle file upload
        let updatedImage = req.body.image; // If no new image, use the existing one

        // If a new image is uploaded, handle file saving
        if (req.file) {
            // If a new image is uploaded, handle file saving in 'public/uploads' folder
            const imagePath = path.join(__dirname, 'public', 'uploads', req.file.filename); // Save the file in public/uploads
            updatedImage = 'uploads/' + req.file.filename; // Store only the relative path to the image

            // Optionally, remove the old image from the server if a new one is uploaded
            if (req.body.existingImage) {
                const oldImagePath = path.join(__dirname, 'public', 'uploads', req.body.existingImage);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log(err);
                });
            }
        }
        // Update the blog post in the database
        const updatedBlog = await BlogPost.findByIdAndUpdate(
            id,
            {
                title,
                author,
                categories,
                description,
                content,
                tags,
                status,
                postType,
                image: updatedImage // Save the new or existing image
            },
            { new: true } // Return the updated blog post
        );

        if (!updatedBlog) {
            return res.status(404).send('Blog post not found');
        }

        // Redirect to the updated blog post page
        req.flash('message', 'Post Updated!')
        res.redirect(`/admin/updatePage/${updatedBlog._id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const deleteBlog = async (req, res) => {
    const { id } = req.params; // Extract the blog ID from the route parameters

    try {
        // Attempt to find and delete the blog post by its ID
        const blog = await BlogPost.findByIdAndDelete(id);

        if (!blog) {
         
            console.log(`Blog with ID ${id} not found.`);
            return res.redirect(req.get('referer') || '/admin/blogs');
        }

        console.log(`Deleted blog with ID: ${blog.title}`);
        req.flash('message', `Deleted blog` )
        res.redirect(req.get('referer') || '/admin/blogs'); // Redirect to the referring page or a default page
    } catch (error) {
        console.error(`Error deleting blog: ${error.message}`);
        res.status(500).send('Server error'); // Send a 500 error response if something goes wrong
    }
};

const deleteMessage = async (req, res) => {
    const { id } = req.params; // Extract the blog ID from the route parameters

    try {
        // Attempt to find and delete the blog post by its ID
        const message = await Message.findByIdAndDelete(id);

        if (!message) {
         
            console.log(`messagewith ID ${id} not found.`);
            return res.redirect('admin/messageBox'); 
        }

        // console.log(`Deleted message with ID: ${message}`);
        req.flash('message', `Deleted Message` )
        res.redirect('/admin/messages' , ); 
    } catch (error) {
        console.error(`Error deleting blog: ${error.message}`);
        res.status(500).send('Server error'); // Send a 500 error response if something goes wrong
    }
};
const deleteMessageCollection = async (req, res) => {
    const { collectionName } = req.params;

    try {
        // Log all collections for debugging
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map((c) => c.name));

        // Check if the collection exists
        const collection = collections.find((c) => c.name === collectionName);
        if (!collection) {
            console.error(`Collection '${collectionName}' does not exist.`);
            req.flash('error', `Collection '${collectionName}' does not exist.`);
            return res.redirect('/admin/messages'); // Adjust path as needed
        }

        // Delete the collection
        await mongoose.connection.db.dropCollection(collectionName);
        console.log(`Collection '${collectionName}' deleted successfully.`);
        req.flash('success', `All '${collectionName}' deleted successfully.`);
        res.redirect('/admin/messages'); // Adjust redirect path as needed
    } catch (error) {
        console.error("Error deleting collection:", error);
        req.flash('error', "An error occurred while deleting the collection.");
        res.status(500).redirect('/admin/messages'); // Adjust path as needed
    }
};



const dashboard = async (req, res) => {
    try {
        const recentVisits = await Visit.find().sort({ timestamp: -1 }).limit(5);
        const visitCount = await Visit.countDocuments();
        const postCount = await BlogPost.countDocuments();
        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const publishedCount = await BlogPost.countDocuments({status: "published"});

        // Get all posts with view counts
        const posts = await BlogPost.find();
        const postsWithViews = await Promise.all(posts.map(async (post) => {
            const viewCount = await Visit.countDocuments({ postId: post._id });
            const commentCount = post.comments ? post.comments.length : 0;
            const likeCount = post.likes || 0;
            const dislikeCount = post.dislikes || 0;
            return { ...post.toObject(), viewCount, commentCount, likeCount, dislikeCount  };
        }));

        // Calculate total views across all posts
        const totalViews = postsWithViews.reduce((sum, post) => sum + post.viewCount, 0);
        //Get all comments with comment count
        const totalComments = postsWithViews.reduce((sum, post) => sum + post.commentCount, 0);
       //Get all comments with like count
       const totalLikes = postsWithViews.reduce((sum, post )=> sum+post.likeCount, 0);
        //Get all comments with like count
       const totalDisLikes = postsWithViews.reduce((sum, post )=> sum+post.dislikeCount, 0);

        // Render the dashboard with data
        res.render('admin/dashboard', { visitCount, postCount, publishedCount,  postsWithViews, recentVisits, totalViews, totalComments, draftCount,totalLikes,totalDisLikes  });
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
};

const getMessage = async( req, res) =>{
    try {
        // Fetch all messages from the database, sorted by newest first
        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const messages = await Message.find().sort({ createdAt: -1 });

        const messageCount = await Message.countDocuments();

        // Render the HTML page and pass the messages data
        res.render('admin/messageBox', {  message: req.flash('message'), messages, messageCount,draftCount  });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages.');
    }
}

const postBlog = async(req,res) =>{
    try {
        const draftCount = await BlogPost.countDocuments({ status: "draft" });
        res.render('admin/postBlog', { draftCount, message: req.flash('message')});
    } catch (error) {
        console.error("Error rendering postBLog:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}

const createPost = async (req, res) => {
    try {
       
        const { title, author, categories, description, content, postType, tags } = req.body;
        const image = req.file ? req.file.path : null;

        // if (!title || !author || !categories || !description || !content || !postType || !tags || !image) {
        //     return res.status(400).json({ message: 'Please provide all required fields.' });
        // }

        let status = req.body.action === "draft" ? "draft" : "published";

        const newPost = new BlogPost({
            title,
            author,
            categories,
            content,
            image,
            postType,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            description,
            status
        });

        await newPost.save();

        req.flash('message', status === "draft" ? 'Saved as draft!' : 'Posted New Blog!');
        res.redirect(status === "draft" ? 'postBlog' : 'postBlog');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Failed to create blog post', error: error.message });
    }
};
 


  //saveDraft
  const saveDraft = async (req, res) => {
    try {
        const { title, author, categories, description, content, postType, tags } = req.body;
        const image = req.file ? req.file.path : null;

        // if (!title || !author || !categories || !description || !content || !postType || !tags || !image) {
        //     return res.status(400).json({ message: 'Please provide all required fields.' });
        // }

        const newPost = new BlogPost({
            title,
            author,
            categories,
            content,
            image,
            postType,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            description,
            status: "draft"
        });

        await newPost.save();

        req.flash('message', 'Draft saved successfully!');
        res.redirect('postBlog');
    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ message: 'Failed to save draft', error: error.message });
    }
};



  const profilePage = async ( req, res) =>{
    try {
         const draftCount = await BlogPost.countDocuments({ status: "draft" });
        const admins = await Admin.find();
        res.render('admin/profilePage' , { admins,draftCount});
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
        res.status(500).json({ error: "Opps!,Internal Server Error1" });
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

       if(newUser){
        return res.redirect('login-page');
       }
       
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error2" });
    }
};

const adminLogout = async (req,res)=>{
    try{

        res.cookie("jwt","", {maxAge:0})
        req.flash('message_out', 'Logout Successfully!');
        res.redirect('login-page')

    }catch(error){
        console.log("Error in log out controller",  error.message)
        res.status(500).json({error: "Internal server error3"})
    }

}

const searchPage = async ( req, res) =>{
     const query = req.query.search || ''
     let results = [];
     if (query) {
        // Perform a search on the 'name' or 'description' fields
        results = await BlogPost.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
    }

    // Render the page with results
    res.render('admin/searchPage', { query, results });
}
const aboutPage = async (req, res) =>{
    try {
        res.render('admin/aboutPage' );
    } catch (error) {
        console.error("Error rendering aboutPage:", error);
        res.status(500).send("An error occurred while loading the aboutPage.");
    }
}



    



module.exports = {
    home,
    dashboard,
    postBlog, 
    profilePage,
    getMessage,
    createPost,
    signupPage,
    loginPage,
    adminLogin,
    adminSignup,
    adminLogout,
    saveDraft,
    getAllBlogs,
    updatePage, 
    updateBlog,
    deleteBlog,
    getAllDraft,
    deleteMessage,
    deleteMessageCollection,
    searchPage,
    aboutPage,


}