// routes/adminRouters.js
const express = require('express');
const { home , showByCategory, getSingleBlog, postComment, contactPage, sendMessage , searchPage, likeBlog, aboutPage, dislikeBlog} = require('../controllers/pageController'); // Adjusted import
const router = express.Router();


router.get('/home', home);// Correctly set up the route
router.get('/category/:category', showByCategory);
router.get('/category/nutrition', showByCategory);
router.get('/blog/:id', getSingleBlog)
router.get('/contact', contactPage)
router.get('/searchPage', searchPage)
router.get('/aboutPage', aboutPage);

router.post('/comment', postComment)
router.post('/sendMessage', sendMessage)
router.post('/blog/:id/like', likeBlog);
router.post('/blog/:id/dislike', dislikeBlog);



module.exports = router; // Export the router
