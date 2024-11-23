const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "draft",
    trim: true,
  },
  author: {
    type: String,
    default: "draft",
    trim: true,
  },
  categories: {
    type: String,
    enum: [
      'nutrition', 'fitness', 'mental-health', 'wellness', 'chronic-conditions',
      'lifestyle', 'health-news', 'personal-stories', 'expert-advice', 'product-reviews',
    ],
    default: "nutrition", // Change to a valid category
  },
  image: {
    type: String,
    default: "draft",
  },
  description: {
    type: String,
    required: true,
    default: "", // 
  },
  content: {
    type: String,
    default: "draft",
  },
  tags: {
    type: [String],
    default: [],
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  comments: [{ 
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
  postType: {
    type: String,
    default: "draft",
  },
  status: { type: String, default: "draft" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
