import mongoose from "mongoose";

const myDocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    coverphoto: {
        type: String,
    },
    owner: {
        type: String,
        required: true 
    },
    domain: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
        required: true,
        default: 0 
    },
    rating: {
        type: Number,
        required: true,
        default: 0 
    },
    date: {
        type: Date,
        default: Date.now, 
    },
    tags: [{
        type: String,
    }],
    documents: [{
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }]
});

const myDocument = mongoose.model('document',myDocumentSchema);

export default myDocument;
