const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  categories: {
    type: String,
    enum: [
      'nutrition', 'fitness', 'mental-health', 'wellness', 'chronic-conditions',
      'lifestyle', 'health-news', 'personal-stories', 'expert-advice', 'product-reviews',
    ],
    required: true,
  },
  image: {
    type: String, // Assuming you'll store the image as a URL or file path
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  tags: {
    type: [String], // Array of strings, each tag separated by commas
    default: [],
  },
 
 viewCount:{
  type: Number,
  default :0
 },

 comments: [{ 
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}],
  postType:{
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
