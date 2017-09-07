let mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/user');
let people=new mongoose.Schema({
    username:String,
    password:String,
})
// let People=mongoose.model('People',people);

module.exports=mongoose.model('People',people);
// let people1=new People({
//     username:"komolei",
//     password:"123456",
// })
// people1.save((err,doc)=>{
//     if(err) console.log(err);
//     console.log('save success',+doc);
// })