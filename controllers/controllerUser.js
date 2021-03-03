const { UserModel } = require('../models/userModel');

exports.getUserInfo = async (req, res) => {
    if (req.body.username == null) {
        return res.status(400).json({ error: 'Username unknown' });
    }
    try {
        const users = await UserModel.findOne(
            {
                username: req.body.username
            }).exec((err_user, user) => {
                if (err_user)
                    return res.status(409).json({ error: "User doesn't exist" });
                res.send(user);
            });
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.registerUser = function (req, res) {
    if (req.body.password == undefined || req.body.username == undefined || req.body.email == undefined)
        return res.status(400).json({ error: "Missing arguments" });

    UserModel.findOne({ username: req.body.username }).exec((err_user, user) => {
        if (err_user)
            return res.status(500).json(err_user);
        if (user !== null)
            return res.status(409).json({ error: "User already exist" });

        var newUser = new UserModel();
        newUser.setUserFromRegister(req.body);

        newUser.save((err_saved, saved) => {
            if (err_saved)
                return res.status(500).json(err_saved);
            return res.status(200).json({ accessToken: saved.accessToken });
        });
    })
}

exports.loginUser = function (req, res) {
    if (req.body.username == undefined || req.body.password == undefined)
        return res.status(400).json({ error: 'Missing arguments' });

    UserModel.findOne({ username: req.body.username }).exec((err_user, user) => {
        if (err_user)
            return res.status(500).json(err_user);
        if (user === null)
            return res.status(400).json({ error: 'Username or password unknown' });

        if (user.validPassword(req.body.password)) {
            user.generateAccessToken(req.body.user);
            user.save((err_saved, saved) => {
                if (err_saved)
                    return res.status(500).json(err_saved);
                else
                    return res.status(200).json({
                        id: saved._id,
                        accessToken: saved.accessToken,
                    });
            });
        } else
            return res.status(400).json({ error: 'Username or password unknown' });
    });
}

exports.loginGoogleUser = function (req, res) {
    if (req.body.googleID === undefined || req.body.username === undefined || req.body.email === undefined)
        return res.status(400).json({error: 'Missing arguments'});

    UserModel.findOne({googleID: req.body.googleID}).exec((err_user, user) => {
        if (err_user)
            return res.status(500).json(err_user);

        if (user !== null) {
            user.generateAccessToken(req.body.user);
            user.save((err_saved, saved) => {
            if (err_saved)
                return res.status(500).json(err_saved);
            else
                return res.status(200).json({
                    id: saved._id,
                    accessToken: saved.accessToken,
                });
            });
        } else {
            var newUser = new UserModel();
            newUser.setUserFromRegister(req.body);
            newUser.save((err_saved, saved) => {
            if (err_saved)
                return res.status(500).json(err_saved);
            return res.status(200).json({
                id: saved._id,
                accessToken: saved.accessToken
                });
            });
        }
    });
}

exports.confirmUser = function (req, res) {
    if (req.query['token'] === undefined)
        return res.status(400).json({error: "Missing token"});

    const modification = {$set: {confirmed: true}};
    UserModel.findOneAndUpdate({accessToken: req.query['token']}, modification, {new: true}).exec((err_user, user) => {
        if (err_user)
            return res.status(400).json(err_user);
        return res.status(200).json({reponse: "User created"});
    });
}

exports.getUser = function (req, res) {
    UserModel.findOne({_id: req.params.id}).exec((err_id, user) => {
        if (err_id)
            return res.status(500).json(err_id);
        return res.status(200).json({username: user.username, email: user.email});
    });
}
