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
router.use(protectedRoute); // Apply middleware to all routes below this line

router.get('/home', home);
router.get('/dashboard', dashboard);
router.get('/postBlog', postBlog);
router.get('/profilePage', profilePage);
router.get('/messages', getMessage);
router.get('/blogs', getAllBlogs);
router.get('/drafts', getAllDraft);
router.get('/updatePage/:id', updatePage);
router.get('/searchPage', searchPage);

router.post('/createPost', upload.single('image'), createPost);
router.post('/saveDraft', upload.single('image'), saveDraft);
router.patch('/updateBlog/:id', upload.single('image'), updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);
router.delete('/deleteMessage/:id', deleteMessage);
router.post('/deleteMessageCollection/:collectionName', deleteMessageCollection);
router.post('/logout', adminLogout);

module.exports = router; // Export the router
