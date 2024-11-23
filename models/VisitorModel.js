const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    ipAddress: String,
    userAgent: String,
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost'
    },
    timestamp: { type: Date, default: Date.now }
});

// Create a unique index to prevent duplicate visits for the same IP and post
visitSchema.index({ ipAddress: 1, postId: 1 }, { unique: true });

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
