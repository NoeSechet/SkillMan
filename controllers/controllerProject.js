const { ProjectModel } = require('../models/projectModel');

exports.getProjectInfo = async (req, res) => {
    if (req.body.projetName == null) {
        return res.status(400).json({ error: 'Project unknown' });
    }
    try {
        await ProjectModel.findOne(
            {
                name: req.body.projectName
            }).exec((err_user, project) => {
                if (err_user)
                    return res.status(409).json({ error: "Project doesn't exist" });
                res.send(project);
            });
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.addProject = function (req, res) {
    if (req.body.projectName == undefined || req.body.description == undefined || req.body.type == undefined)
        return res.status(400).json({ error: "Missing arguments" });

    ProjectModel.findOne({ projectName: req.body.projectName }).exec((err_project, project) => {
        if (err_project)
            return res.status(500).json(err_project);
        if (project !== null)
            return res.status(409).json({ error: "Project already exist" });

        var newProject = new ProjectModel();
        newProject.generateProject(req.body);

        newProject.save((err_saved, project) => {
            if (err_saved)
                return res.status(500).json(err_saved);
            return res.status(200).json({ id: project._id });
        });
    })
}

exports.deleteProject = function (req, res) {
    ProjectModel.findByIdAndRemove(req.params.id).exec((err_project, project) => {
        if (err_project)
            return res.status(500).json(err_project);
        res.status(200).json({ response: 'Project deleted' });
    });
}

exports.getUserProject = function (req, res) {
    ProjectModel.find({ userID: req.params.id }).exec((err_project, project) => {
        if (err_project)
            return res.status(500).json(err_project);
        return res.status(200).json(project);
    });
}

exports.modifyProject = function (req, res) {
    const modifications = {
        $set: {
            projectName: req.body.projectName,
            description: req.body.description,
            userID: req.body.userID,
        }
    };
    ProjectModel.findByIdAndUpdate(req.params.id, modifications, { new: true }).exec((err_project, project) => {
        if (err_project)
            return res.status(500).json(err_project);
        return res.status(200).json({ reponse: "Project modified" });
    });
}