import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName:{
        type: String,
        required: true 
    },
    fileData:{
        type: String,
        required: true 
    },
})

const File = mongoose.model('newfile',fileSchema);

export default File;