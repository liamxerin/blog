// routes/adminRouters.js
const express = require('express');
const { home , showByCategory, getSingleBlog} = require('../controllers/pageController'); // Adjusted import
const router = express.Router();


router.get('/home', home);// Correctly set up the route
router.get('/category/:category', showByCategory);
router.get('/category/nutrition', showByCategory);
router.get('/blog/:id', getSingleBlog)


module.exports = router; // Export the router
