import mongoose from "mongoose";

const homeFeatureProjectsObject = new mongoose.Schema({
    topic:{
        type: String,
    },
    projects: [{
        type: String,
    }],
})

const homeFeatureProjects = mongoose.model('homeFeatureProjects',homeFeatureProjectsObject);

export default homeFeatureProjects;