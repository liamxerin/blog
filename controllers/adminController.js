const BlogPost = require('../models/BlogModel');
const home = async (req, res) =>{
    try {
        res.render('admin/index');
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
}

const dashboard = async(req,res) =>{
    try {
        res.render('admin/dashboard');
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
// const login = async(req, res) =>{
//     try{

//     }catch(error){

//     }
// }
module.exports = {
    home,
    dashboard,
    postBlog, 
    createPost,
}