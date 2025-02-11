// routes/adminRouters.js
const express = require('express');
const {
    home,
    dashboard,
    postBlog,
    createPost,
    getMessage,
    profilePage,
    adminSignup,
    adminLogin,
    signupPage,
    loginPage,
    adminLogout,
    saveDraft,
    getAllBlogs,
    updatePage,
    updateBlog,
    deleteBlog,
    getAllDraft,
    deleteMessage,
    deleteMessageCollection,
    searchPage
} = require('../controllers/adminController');

const router = express.Router();
const upload = require('../config/multer');
const protectedRoute = require('../middleware/protectRoute.js');
const methodOverride = require('method-override');
router.use(methodOverride('_method')); // This ensures method override works

// Public routes
router.get('/signup-page', signupPage);
router.get('/login-page', loginPage);
router.post('/signup', adminSignup);
router.post('/login', adminLogin);

// Protected routes
// router.use(protectedRoute); // Apply middleware to all routes below this line

router.get('/home',protectedRoute, home);
router.get('/dashboard',protectedRoute, dashboard);
router.get('/postBlog',protectedRoute, postBlog);
router.get('/profilePage',protectedRoute, profilePage);
router.get('/messages',protectedRoute, getMessage);
router.get('/blogs',protectedRoute, getAllBlogs);
router.get('/drafts',protectedRoute, getAllDraft);
router.get('/updatePage/:id',protectedRoute, updatePage);
router.get('/searchPage',protectedRoute, searchPage);

router.post('/createPost', upload.single('image'), createPost);
router.post('/saveDraft', protectedRoute,upload.single('image'), saveDraft);
router.patch('/updateBlog/:id',protectedRoute, upload.single('image'), updateBlog);
router.delete('/deleteBlog/:id',protectedRoute, deleteBlog);
router.delete('/deleteMessage/:id', protectedRoute,deleteMessage);
router.post('/deleteMessageCollection/:collectionName',protectedRoute, deleteMessageCollection);
router.post('/logout', adminLogout);

module.exports = router; // Export the router
