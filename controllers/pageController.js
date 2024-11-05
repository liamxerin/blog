const BlogPost = require('../models/BlogModel')
const home = async (req, res) => {
   
    try {
        // Fetch posts with either 'feature' or 'main' post types
        const posts = await BlogPost.find({ postType: { $in: ['feature', 'main'] } })
            .sort({ createdAt: -1 })  // Optional: Sort by creation date
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
        
        if (!posts.length) {
            return res.render('page/category', { posts: [], category, message: `No posts found for ${category}` });
        }

        // Render the category page with posts and category name
        res.render('page/category', { posts, category, message: null });
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

        // Render the view with the found post
        res.render('page/blog', { post, message: null });
    } catch (error) {
        console.error("Error fetching single blog post:", error);
        res.status(500).send("An error occurred while fetching the blog post.");
    }
};






  

module.exports ={
    home,
    showByCategory,
    getSingleBlog
}