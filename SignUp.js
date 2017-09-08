let mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost/user", { useMongoClient: true });
let userSignUp = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    surePassword: String,
    createTime: Date,
    lastLogin: Date,
})

module.exports = mongoose.model('userSignUp', userSignUp);