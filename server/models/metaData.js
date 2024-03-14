import mongoose from "mongoose";

const metaData = new mongoose.Schema({
    type: {
        type: String,
    },
    domain: {
        type: mongoose.Schema.Types.Mixed, // Use Mixed type for flexibility
    },
});

const websiteMetaData = mongoose.model('metadata', metaData);

export default websiteMetaData;
