const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
});

projectSchema.methods.generateProject = function (body) {
    this.projectName = body.projectName;
    this.description = body.desctription;
    this.type = body.type;
};

const ProjectModel = mongoose.model(
    "projects",
    projectSchema
);

module.exports = { ProjectModel };