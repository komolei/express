let express = require('express');
let app = express();
let path = require('path');
// let mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/user'); //forget to connect mongodb
// let UserSignUp = require('./SignUp.js');
// let db = mongoose.connection;

app.get('/', (req, res) => {
    console.log("use express by myself");
    // res.send('hello my first express application');
    // now send .html
    // res.send(index.html);//error 
    // res.sendFile(process.cwd() + '/app/view/html/index.html');
    res.sendFile(process.cwd() + '/app/view/html/bootstrap.html');

})
// static resource

app.use(express.static(path.join(__dirname, '/app/view')));
// app.get('/next1', (req, res) => {
//     res.send("you are at next1's page")
// })
// app.get('/next', (req, res, next) => {
//     console.log("next()");
//     // res.send("next(),first"); //The express frame just allow one res.send();
//     next();
// }, (req, res) => {
//     console.log("no more next");
//     res.send('next()');
// })

// // user array of functions can handle a route
// let b1 = (req, res, next) => {
//     console.log("array of function b1");
//     next();
// }
// let b2 = (req, res, next) => {
//     console.log("array of function b2");
//     next();
// }
// let b3 = (req, res, next) => {
//     console.log("b3");
//     next();
// }
// let b4 = (req, res, next) => {
//     console.log("b4");
//     res.send('this is over in the array of funcitons')
// }
// app.get('/arrayNext', [b1, b2, b3, b4])

// // use app.router(); SUPPORT call chaining
// app.route('/router').get((req, res) => {
//     // res.send("router get");
//     res.redirect('/next1');
// }).post((req, res) => {
//     res.send("router post");
// }).put((req, res) => {
//     res.redirect('/arrayNext');
// })

// //middleware 

// app.use((req, res, next) => {
//     console.log("middleware");
//     console.log("req.url:", req.originalUrl);
//     next();
// })
// app.use('/time',function (req, res, next) {
//     console.log('Time:', Date.now());
//     next();
// });
// app.use('/time',(req,res,next)=>{
//     res.send('middleware use');
// })
//mongodb connection 
let mongodbConnection = () => {
    let mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/user', { useMongoClient: true }); //forget to connect mongodb
    return mongoose.connection;
}
//SignUp userInfo
let SignUpInfo = (data) => {
    let UserSignUp = require('./SignUp.js');
    return new UserSignUp({
        email: data.email,
        username: data.username,
        password: data.password,
        surePassword: data.surePassword,
    })

}
//body-parser
// let bodyParserHandle = (data) => {
//     let bodyParser = require('body-parser');
//     app.use(bodyParser.urlencoded({
//         extended: true,
//     }))
// }
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.post('/signUp', (req, res) => {
    // console.log("req:", req.query);//get form data 
    // let data = req.query;
    // console.log("req.query", req.query);
    console.log("------------------");
    console.log("req.body", req.body);
    // let user = SignUpInfo(req.query);// apply to get request
    let user = SignUpInfo(req.body);
    let db = mongodbConnection();
    console.log("user data:", user);
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        // console.log(res, "connection open", user);
        user.save((err, doc) => {
            if (err) console.log(err);
            // res.redirect('/next')
            res.json({username:user.username})
            console.log("save success", doc);
        })
    })
    // close mongoDB
    // db.close();
})

// to bind model 
app.post('/signIn', (req, res) => {
    // invoke function to find userInfo is true
    let db = mongodbConnection();
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        //to bind model 
        let user = require('./SignUp.js');
        // to query,use $where
        let userInfo = req.body;
        // user.$where('this.username==='+userInfo.username).find((err, docs) => {
        //     if (err) return console.error(err);
        //     console.log("this is docs", docs);
        // })
        console.log("request info:", userInfo);
        user.find({ username: userInfo.username }, (err, docs) => {
            if (err) return console.error(err);
            console.log("this is docs", docs, docs.length);
            if (!docs.length) return console.error("user name is't right");
        }).find({ password: userInfo.password }, (err, docs) => {
            if (err) return console.error(err);
            console.log(docs);
            if (!docs.length) return console.error("user password is't right");
            // res.send("login success "+userInfo.username);
            res.json({ username: userInfo.username })
        })
        // query password
        // user.find({ password: userInfo.password }, (err, docs) => {
        //     if (err) return console.error(err);
        //     console.log(doc);
        // })
        // to query, use where
        // let userInfo = req.body;
        // console.log(userInfo, "req.body");
        // user.where('username').select(userInfo.username).find((err, docs) => {
        //     if (err) console.error(err, "you are failed");
        //     console.log("this docs is:", docs);
        // })
    })
    // db.close();
    
})
app.get('/signOut',(req,res)=>{
    console.log(req.query,"nothing");
    // res.redirect('/next');
    res.sendFile(process.cwd() + '/app/view/html/bootstrap.html');
    // res.send('fuck')
    
})
app.use('/next', (req, res) => {
    res.send('signUp success');
    // res.sendFile(process.cwd() + '/app/view/html/bootstrap.html');
    
})
let server = app.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})