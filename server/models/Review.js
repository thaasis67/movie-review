const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,    
    },
    reviewText: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;