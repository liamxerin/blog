// routes/adminRouters.js
const express = require('express');
const { home, 
    dashboard, 
    postBlog, 
    createPost , 
    profilePage,
    adminSignup , 
    adminLogin , 
    signupPage,
     loginPage , 
     adminLogout, 
    
     } = require('../controllers/adminController'); 

const router = express.Router();
const upload = require('../config/multer');
const protectedRoute = require('../middleware/protectRoute.js')
router.get('/home', protectedRoute, home);
router.get('/dashboard', protectedRoute, dashboard); 
router.get('/postBlog', protectedRoute, postBlog)
router.get('/profilePage', protectedRoute, profilePage)
router.post('/createPost',  protectedRoute, upload.single('image') , createPost )

router.get('/signup-page', signupPage)
router.get('/login-page', loginPage)
router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/logout', adminLogout)
module.exports = router; // Export the router
