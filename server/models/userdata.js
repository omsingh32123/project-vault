import mongoose from "mongoose";

const userData = new mongoose.Schema({
    email: {
        type: String,
        required: true 
    },
    earned: {
        type: Number,
        default: 0
    },
    sold: [{
        type: String,
    }],
    documents: [{
        type: String,
    }],
    purchased: [{
        type: String,
    }]
});

const blankUserData = mongoose.model('users', userData);

export default blankUserData;
