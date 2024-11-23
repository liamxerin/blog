const BlogPost = require('../models/BlogModel')
const Visit = require('../models/VisitorModel')
const Message = require('../models/MessageModel')
const home = async (req, res) => {
    try {
      const ipAddress = req.ip; // Capturing visitor's IP address
      const userAgent = req.headers['user-agent']; // Capturing visitor's user agent
  
      // Check if the visitor's IP is already recorded in the Visit collection
      const existingVisit = await Visit.findOne({ ipAddress });
  
      if (!existingVisit) {
        // If the IP address hasn't been recorded, create a new Visit
        const visit = new Visit({
          ipAddress,
          userAgent
        });
  
        await visit.save(); // Save the visit to the database
      }
  
      // Fetch posts with either 'feature' or 'main' post types
      const posts = await BlogPost.find({ postType: { $in: ['feature', 'main'] } })
        .sort({ createdAt: -1 })  // Sort by creation date
        .select('-content');       // Exclude 'content' field if not needed
  
      // Separate main and feature posts
      const mainPost = posts.find(post => post.postType === 'main');
      const featurePosts = posts.filter(post => post.postType === 'feature');
  
      // Render the view with separated main and feature posts
      res.render('page/home', { mainPost, featurePosts });
    } catch (error) {
      console.error("Error rendering home:", error);
      res.status(500).send("An error occurred while loading the home page.");
    }
  };

  const contactPage = async ( req,res) =>{
    try{

        res.render('page/contact', { message: req.flash('message')})

    }catch(error){
        console.error("Error rendering contactPage:", error);
        res.status(500).send("An error occurred while loading the contact page.");
    }
  }
  const sendMessage = async(req,res)=>{
    const { name, email, message } = req.body;

    try {
        // Create a new message document
        const newMessage = new Message({ name, email, message });

        // Save the message to the database
        await newMessage.save();
        if(newMessage) {
            req.flash('message', 'Message Sent!')
            return res.redirect('contact');
         }
        // Send a success response
        res.status(201).json({ message: 'Message sent and saved successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message. Please try again later.' });
    }
}



const showByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        
        // Fetch posts based on the specified category
        const posts = await BlogPost.find({ categories: category })
            .sort({ createdAt: -1 })  // Optional: sort posts by creation date
            .select('-content');       // Exclude content if you only want summaries
            const postsWithComments = posts.map(post => ({
                ...post.toObject(),
                totalComments: post.comments.length,
            }));
    
        if (!posts.length) {
            return res.render('page/category', { posts: [], category, message: `No posts found for ${category}` });
        }

        // Render the category page with posts and category name
        res.render('page/category', { posts : postsWithComments, category, message: null,  });
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        res.status(500).send("An error occurred while fetching posts by category.");
    }
};
const getSingleBlog = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post by ID
        const post = await BlogPost.findById(postId);

        if (!post) {
            return res.status(404).render('page/blog', { post: null, message: "Blog post not found" });
        }

        // Capture IP address and user-agent from the request
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        // Check if the IP address has visited this post before
        const existingVisit = await Visit.findOne({ ipAddress, postId });

        // If the IP address hasn't been recorded for this post, increment view count and save the visit
        if (!existingVisit) {
            const visit = new Visit({
                ipAddress,
                userAgent,
                postId  // Save the post ID to track visits per post
            });

            await visit.save(); // Save the visit to the database
            post.viewCount += 1; // Increment the view count on the post
            await post.save();    // Save the updated post
        }

        const totalComments = post.comments.length;
        const commentLabel = totalComments === 1 ? "comment" : "comments";

        // Render the view with the found post and additional data
        res.render('page/blog', { post, message: null, totalComments, commentLabel });
    } catch (error) {
        console.error("Error fetching single blog post:", error);
        res.status(500).send("An error occurred while fetching the blog post.");
    }
};


   
const postComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const postId = req.body.postId; // Assuming you send postId with the form

        // Find the post by ID and add the comment
        const post = await BlogPost.findById(postId);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Push the new comment to the post's comments array
        post.comments.push({ text: comment });
        
        // Save the updated post
        await post.save();

        // Redirect back to the post page
        res.redirect(`/blog/${postId}`); // Make sure this URL matches your routing setup
    } catch (error) {
        console.error("Error in commenting", error);
        res.status(500).send("An error occurred while commenting.");
    }
};
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
   res.render('page/searchPage', { query, results });
}





  

module.exports ={
    home,
    showByCategory,
    sendMessage,
    getSingleBlog,
    postComment,
    contactPage,
    searchPage,

}