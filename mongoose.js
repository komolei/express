let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user');
let People = require('./user.js');
let UserSignUp = require('./SignUp.js');
let db = mongoose.connection;
let people1 = new People({
    username: 'komolei',
    password: '123456',
})
let userSignUp1 = new UserSignUp({
    username: 'clc',
    password: '123',
    surePassword: '234',
})
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log("connection open");
    people1.save((err, doc) => {
        if (err) console.log(err);
        console.log("save success", doc);
    })
    console.log("userSingUp:",userSignUp1);
    userSignUp1.save((err, doc) => {
        if (err) console.log(err);
        console.log("success", doc);
    })
})
//Good article http://www.cnblogs.com/xusir/archive/2012/12/24/2830957.html
// var kittySchema = mongoose.Schema({
//     name: String
// });
// var Kitten = mongoose.model('Kitten', kittySchema);
// var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'
// kittySchema.methods.speak = function () {
//     var greeting = this.name
//       ? "Meow name is " + this.name
//       : "I don't have a name";
//     console.log(greeting);
//   }
//   var fluffy = new Kitten({ name: 'fluffy' });
//   fluffy.speak(); // "Meow name is fluffy"