import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    name:{
        type: String,
        default: ""
    },
    email:{
        type: String,
        default: ""
    },
    message:{
        type: String,
        default: ""
    },
})

const contactMessage = mongoose.model('contactmessage',contactMessageSchema);

export default contactMessage;