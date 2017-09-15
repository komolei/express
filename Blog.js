let mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost/user", { useMongoClient: true });
let blog = new mongoose.Schema({
    index: Number,
    title: String,
    author: String,
    content: String,
    // img: String,
    createTime: Date,
    // modifiedTime: Date,
})

module.exports = mongoose.model('blog', blog);