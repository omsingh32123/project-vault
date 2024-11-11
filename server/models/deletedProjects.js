import mongoose from "mongoose";

const deletedProject = new mongoose.Schema({
    id: {
        type: String,
    },
});

const deletedProjects = mongoose.model('deleted', deletedProject);

export default deletedProjects;
