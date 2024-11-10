const BlogPost = require('../models/BlogModel')
const Visit = require('../models/VisitorModel')
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
        post.viewCount +=1
        await post.save(); 
        const totalComments = post.comments.length;
        const commentLabel = totalComments === 1 ? "comment" : "comments";
        // Render the view with the found post
        res.render('page/blog', { post, message: null, totalComments, commentLabel });
    } catch (error) {
        console.error("Error fetching single blog post:", error);
        res.status(500).send("An error occurred while fetching the blog post.");
    }
}
   
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








  

module.exports ={
    home,
    showByCategory,
    getSingleBlog,
    postComment,
}