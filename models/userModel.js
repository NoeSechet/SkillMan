const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    accessToken: {
        type: String,
        required: true
    }
  });

userSchema.methods.setPassword = function (password) { // Set salt and hash in DB
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) { // Check if password match with salt and hash from DB
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateAccessToken = function (username) { // Generate and save a new accessToken in DB
    this.accessToken = jwt.sign({user: username}, process.env.ACCESS_TOKEN_SECRET);
}

userSchema.methods.setUserFromRegister = function (body) { // Set user variables
    this.username = body.username
    this.email = body.email
    this.googleID = body.googleID
    this.generateAccessToken(body.username);
    
    if (body.password !== undefined) {
        this.setPassword(body.password);
        this.confirmed = false
    } else
        this.confirmed = true // Google login first time
}

const UserModel = mongoose.model(
    "users",
    userSchema
);

module.exports = { UserModel };