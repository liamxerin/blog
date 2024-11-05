// routes/adminRouters.js
const express = require('express');
const { home, dashboard, postBlog, createPost } = require('../controllers/adminController'); // Adjusted import
const router = express.Router();
const upload = require('../config/multer');

router.get('/home', home);// Correctly set up the route
router.get('/dashboard', dashboard); 
router.get('/postBlog', postBlog)
router.post('/createPost', upload.single('image') , createPost )
module.exports = router; // Export the router
