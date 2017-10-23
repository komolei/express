let express = require('express')
let app = express()
let path = require('path')
let router = express.Router()
let fetch = require('node-fetch')
// let mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/user') //forget to connect mongodb
// let UserSignUp = require('./SignUp.js')
// let db = mongoose.connection

app.get('/', (req, res) => {
  console.log('use express by myself')
  // res.send('hello my first express application')
  // now send .html
  // res.send(index.html)//error 
  // res.sendFile(process.cwd() + '/app/view/html/index.html')
  res.sendFile(process.cwd() + '/app/view/html/index.html')
})

// static resource

app.use(express.static(path.join(__dirname, '/app/view')))

// app.get('/next1', (req, res) => {
//     res.send("you are at next1's page")
// })
// app.get('/next', (req, res, next) => {
//     console.log("next()")
//     // res.send("next(),first"); //The express frame just allow one res.send()
//     next()
// }, (req, res) => {
//     console.log("no more next")
//     res.send('next()')
// })

// // user array of functions can handle a route
// let b1 = (req, res, next) => {
//     console.log("array of function b1")
//     next()
// }
// let b2 = (req, res, next) => {
//     console.log("array of function b2")
//     next()
// }
// let b3 = (req, res, next) => {
//     console.log("b3")
//     next()
// }
// let b4 = (req, res, next) => {
//     console.log("b4")
//     res.send('this is over in the array of funcitons')
// }
// app.get('/arrayNext', [b1, b2, b3, b4])

// // use app.router(); SUPPORT call chaining
// app.route('/router').get((req, res) => {
//     // res.send("router get")
//     res.redirect('/next1')
// }).post((req, res) => {
//     res.send("router post")
// }).put((req, res) => {
//     res.redirect('/arrayNext')
// })

// //middleware 

// app.use((req, res, next) => {
//     console.log("middleware")
//     console.log("req.url:", req.originalUrl)
//     next()
// })
// app.use('/time',function (req, res, next) {
//     console.log('Time:', Date.now())
//     next()
// })
// app.use('/time',(req,res,next)=>{
//     res.send('middleware use')
// })
// mongodb connection 
let mongodbConnection = () => {
  let mongoose = require('mongoose')
  mongoose.connect('mongodb://localhost/user', { useMongoClient: true }) // forget to connect mongodb
  return mongoose.connection
}
// SignUp userInfo
let SignUpInfo = (data) => {
  let UserSignUp = require('./SignUp.js')
  return new UserSignUp({
    email: data.email,
    username: data.username,
    password: data.password,
    surePassword: data.surePassword
  })
}
// body-parser
// let bodyParserHandle = (data) => {
//     let bodyParser = require('body-parser')
//     app.use(bodyParser.urlencoded({
//         extended: true,
//     }))
// }
let bodyParser = require('body-parser')
// to analyze  the http's contentType=application/json
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.post('/signUp', (req, res) => {
  // console.log("req:", req.query)//get form data 
  // let data = req.query
  // console.log("req.query", req.query)
  console.log('------------------')
  console.log('req.body', req.body)
  // let user = SignUpInfo(req.query)// apply to get request
  let user = SignUpInfo(req.body)
  let db = mongodbConnection()
  console.log('user data:', user)
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', () => {
    // console.log(res, "connection open", user)
    user.save((err, doc) => {
      if (err) console.log(err)
      // res.redirect('/next')
      res.json({ username: user.username })
      console.log('save success', doc)
    })
  })
  // close mongoDB
  // db.close()
})

// to bind model 
app.post('/signIn', (req, res) => {
  // invoke function to find userInfo is true
  let db = mongodbConnection()
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', () => {
    // to bind model 
    let user = require('./SignUp.js')
    // to query,use $where
    let userInfo = req.body
    // user.$where('this.username==='+userInfo.username).find((err, docs) => {
    //     if (err) return console.error(err)
    //     console.log("this is docs", docs)
    // })
    console.log('request info:', userInfo)
    user.find({ username: userInfo.username }, (err, docs) => {
      if (err) return console.error(err)
      console.log('this is docs', docs, docs.length)
      if (!docs.length) return console.error("user name is't right")
    }).find({ password: userInfo.password }, (err, docs) => {
      if (err) return console.error(err)
      console.log(docs)
      if (!docs.length) return console.error("user password is't right")
      // res.send("login success "+userInfo.username)
      res.json({ username: userInfo.username })
    })
    // query password
    // user.find({ password: userInfo.password }, (err, docs) => {
    //     if (err) return console.error(err)
    //     console.log(doc)
    // })
    // to query, use where
    // let userInfo = req.body
    // console.log(userInfo, "req.body")
    // user.where('username').select(userInfo.username).find((err, docs) => {
    //     if (err) console.error(err, "you are failed")
    //     console.log("this docs is:", docs)
    // })
  })
  // db.close()

})
app.get('/signOut', (req, res) => {
  console.log(req.query, 'nothing')
  // res.redirect('/next')
  res.sendFile(process.cwd() + '/app/view/html/bootstrap.html')
  // res.send('fuck')

})
app.use('/next', (req, res) => {
  res.send('signUp success')
  // res.sendFile(process.cwd() + '/app/view/html/bootstrap.html')

})
app.get('/blog', (req, res) => {

  let db = mongodbConnection()
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', () => {
    let blog = require('./Blog.js')
    let blogInfo = req.query
    console.log('blogInfo1', req.query)
    // blog.find
  })
})
// oauth

app.get('/getGithub', (req, res) => {
  let firstUrl = 'https://github.com/login/oauth/authorize?client_id=517ea4027af95e1823b1&state=1314&scope=user'
  // fetch(firstUrl, { mothed: 'get' })
  //   // .then(response => response.json())
  //   .then(data => {

  //     let code = data.code;
  //     let url = 'http://localhost:4000/path/github/callback';
  //     res.redirect(url);
  //     // res.redirect('http://localhost:4000/path/github/callback')
  //   });
  console.log("fadlfajdf;aflqafj");
  res.redirect(firstUrl);
})

// test a //the result is good
app.get('/getA', (req, res) => {
  let body = [{
    name: 'clc',
    age: '24',
    sex: 'male',
    http: 'http://www.baidu.com',
  }, {
    name: 'clc',
    age: '24',
    sex: 'male',
    http: 'http://www.baidu.com',
  }, {
    name: 'clc',
    age: '24',
    sex: 'male',
    http: 'http://www.baidu.com',
  }, {
    name: 'clc',
    age: '24',
    sex: 'male',
    http: 'http://www.baidu.com',
  }, {
    name: 'clc',
    age: '24',
    sex: 'male',
    http: 'http://www.baidu.com',
  }]
  res.json(body);
})

// // let formData = 'client_id=517ea4027af95e1823b1&client_secret=fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d&code=' + data.code

let request = require('request');

// 10.1 add session 
// let session = require('express-session');
// app.use(session({
//   secret: 'keyboard cat',
//   cookie: ('name', 'value', {
//     path: '/', httpOnly: true, secure: false, maxAge: 50000
//   }),
//   resave: true,
//   saveUninitialized: false,
// }))

app.get('/path/github/callback', (req, res) => {

  // add session
  let sess = req.session;


  let url2 = 'https://github.com/login/oauth/access_token';
  let data = req.query;

  let option = {
    url: url2,
    headers: {
      // 'User-Agent': 'komolei',
      'content-type': 'application/json',
    },
    form: {
      client_id: '517ea4027af95e1823b1',
      client_secret: 'c0f478694307952421267a739e4d9dafa61a4521',
      code: data.code,
      state: '1314',
      redirect_url: 'http://localhost:4000',
    },

  };
  let querystring = require('querystring');
  request.post(option, function (error, response, body) {
    if (error) {
      return console.log("err is:", error);
    }
    console.log(response, '\n');
    if (!error && response.statusCode == 200) {
      console.log(response.body); // 输出请求到的body
      // res.send(response.body);
      // let data = response.body.query;
      let data = querystring.parse(response.body);
      console.log("data:", data);
      let url22 = 'https://api.github.com/user?access_token=' + data.access_token;
      // fetch(url2, { method: 'get' }).then(response => {
      //   console.log('second response is:', response);
      //   // return response.json()
      //   return response.json();
      // }).then(data => {
      //   let userInfo = data;
      //   res.send("xixi", '\n', userInfo);
      // }).catch(err => console.log('err: ', err))
      let userInfo = request.get({
        url: url22, headers: {
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'User-Agent': 'blog',
        }
      }, function (error, response, body) {
        if (error) {
          return console.log("err2 is:", error);
        }
        console.log(response, '\n');
        if (!error && response.statusCode == 200) {
          console.log(response.body); // 输出请求到的body
          // res.send(response.body);
          // let data = response.body.query;
          // let data = querystring.parse(response.body);
          // console.log("user info:", data);
          // res.json(response.body);
          // res.redirect("/githubLogin");
          // document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'><span class='glyphicon glyphicon-user'></span>" + response.body.login + "</a><span data-toggle='modal' data-target='#signOut'>Sign Out?</span>"

          // res.send({ username: JSON.parse(response.body).login });
          let index = '/?username=' + JSON.parse(response.body).login;
          // { username: JSON.parse(response.body).login }
          // res.json({ username: JSON.parse(response.body).login });
          // res.redirect(index);
          // return response.body;
          sess.name = JSON.parse(response.body).login;
          res.redirect('/');
          // res.json()

        }
      });

    }
  });
  app.get('/githubUser', (req, res) => {
    res.send(res.query);
  })
  // mmp 是后台发请求去认证的，而不是前台，前台可以通过fetch，但是后台却不可以，应该要用到node的http模块吧。这不是很清楚，我是选择使用了，request去发。😔，卡了三天，就这样解决了
  //   let xmlHttp = new XMLHttpRequest();
  //   let xml = "client_id=517ea4027af95e1823b1&client_secret=c0f478694307952421267a739e4d9dafa61a4521&code=" + data.code + "&state=" + data.state;

  //   xmlHttp.open("POST", url, true);
  //   xmlHttp.onreadystatechange = function () {
  //     //当 readyState 等于 4 且状态为 200 时，表示响应已就绪
  //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       requstdata = xmlhttp.responseText;
  //       var requstJson = JSON.parse(requstdata);
  //       // for (var i = 0; i < requstJson.length; i++) {
  //       //   html += "<p>" + requstJson[i].name + ";" + requstJson[i].pwd + "</p>"
  //       // }
  //       // document.getElementById("div1").innerHTML = html;
  //       console.log("requstJson:", requstJson);
  //     }
  //   }
  //   xmlHttp.setRequestHeader("Content-Type",
  //     "application/json;");
  //   xmlHttp.send(xml);
  // })
  // app.get('/path/github/callback', (req, res) => {
  //   console.log("req:", req);
  //   // let firstUrl = 'https://github.com/login/oauth/authorize?client_id=517ea4027af95e1823b1&state=1314&redirect_uri=https://komolei.cn/github'
  //   let data = req.query;
  //   console.log("data is:", data);
  //   console.log("\n");
  //   console.log("\n");
  //   console.log("\n");
  //   // let formData = {
  //   //   client_id: '=517ea4027af95e1823b1&',
  //   //   client_secret: '=c0f478694307952421267a739e4d9dafa61a4521&',
  //   //   code: '=' + data.code + '&',
  //   //   state: '=1314',
  //   //   // redirect_uri: 'https://komolei.cn/github'
  //   // }
  //   // console.log("json parse:", JSON.stringify(formData), "\n", '\n', '\n');
  //   let url = 'https://github.com/login/oauth/access_token'
  //   let url2 = "client_id=517ea4027af95e1823b1&client_secret=c0f478694307952421267a739e4d9dafa61a4521&code=" + data.code + "&state=" + data.state;
  //   console.log("url2:", url2, '\n');
  //   let init = {
  //     method: 'POST',
  //     // mode: 'no-cors',
  //     headers: {
  //       // 'Content-Type': 'application/vnd.github.v3+json',
  //       'Content-Type': 'application/json',
  //       'charset': 'utf-8',
  //       'User-Agent': 'komolei',
  //     },
  //     // body: "client_id=517ea4027af95e1823b1&client_secret=c0f478694307952421267a739e4d9dafa61a4521&code=" + data.code + "&state=" + data.state,
  //     body: url2,
  //     // body: JSON.stringify(formData),
  //     // body: formData,
  //   }

  //   // let FormData = require('form-data');
  //   // let form = new FormData();
  //   // form.append('client_id', '517ea4027af95e1823b1');
  //   // form.append('client-secret', 'c0f478694307952421267a739e4d9dafa61a4521');
  //   // form.append('code', data.code);
  //   // form.append('state', 1314);
  //   // console.log("form:",form);
  //   // const querystring = require('querystring');
  //   // fetch(url, init).then(response => {
  //   //   console.log('first response is:', typeof response, 'sdfadfga', '\n', '\n', '\n')
  //   //   //  console.log('json parse', JSON.parse(response))
  //   //   // res.send(response);
  //   //   return response
  //   // })
  //     // fetch(url, {
  //     //   method: 'POST', body: form,
  //     // })
  //     // .then(data => {
  //     //   console.log('request success,\n', data)
  //     //   let info = data.json();
  //     //   console.log('dfaf:', '\n', typeof info)
  //     //   let url2 = 'https://api.github.com/user?access_token=' + info.access_token
  //     //   fetch(url2, { method: 'get' }).then(response => {
  //     //     // console.log('second response is:', response);
  //     //     // return response.json()
  //     //     return response;
  //     //   }).then(data => {
  //     //     let userInfo = data;
  //     //     res.send("xixi", '\n', userInfo)
  //     //   })
  //     // }).catch(err => console.log('err: ', err))


  //   // fetch(firstUrl, { method: 'get' })
  //   // .then(response => {
  //   //   typeof response; console.log('response:', response); return response;
  //   // })
  //   // .then(data => {
  //   //   console.log('first request:', data, '\n'); return data
  //   // })
  //   // .then(data => {
  //   //   console.log('callback success')
  //   // })
  //   // .then(data => {
  //   //   console.log('first request:', data, '\n'); return data
  //   // })
  //   // .then(data => {
  //   //   console.log('callback success')
  //   //   // let data = req.query
  //   //   console.log("github data'code:", data.code)
  //   //   let formData = {
  //   //     client_id: '517ea4027af95e1823b1',
  //   //     client_secret: 'fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d',
  //   //     code: data.code,
  //   //     redirect_uri: 'https://komolei.cn/github'
  //   //   }
  //   //   let url = 'https://github.com/login/oauth/access_token'
  //   //   let init = {
  //   //     method: 'POST',
  //   //     // mode: 'cors',
  //   //     body: JSON.stringify(formData),
  //   //     headers: {
  //   //       'Content-type': 'application/json'
  //   //     }
  //   //   }
  //   //   console.log('init', init)
  //   //   // let request=new Request(url,init);  
  //   //   // console.log("request is what",request)

  //   //   let formData1 = 'https://github.com/login/oauth/access_token?client_id=517ea4027af95e1823b1&client_secret=fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d&code=' + data.code + 'redirect_uri=https://komolei.cn'
  //   //   // fetch(url, init)

  //   //   console.log('formData:', formData)

  //   //   // fetch(formData1, {method: 'get',headers: {
  //   //   //     'Content-type': 'application/json'
  //   //   // }})

  //   //   fetch(url, init).then(response => {
  //   //     console.log('first response is:', typeof response, 'sdfadfga', '\n')
  //   //     //  console.log('json parse', JSON.parse(response))
  //   //     res.send(response); return response
  //   //   }).then(data => {
  //   //     console.log('request success', data)
  //   //     let info = data
  //   //     console.log('dfaf:', info, '\n', typeof info)
  //   //     let url2 = 'https://api.github.com/user?access_token=' + info.access_token
  //   //     fetch(url2, { method: 'get' }).then(response => {
  //   //       console.log('second response is:', response); return response.json()
  //   //     }).then(data => {
  //   //       let userInfo = data.query
  //   //       res.send(userInfo)
  //   //     })
  //   //   }).catch(err => console.log('err: ', err))
  //   // })
});


// use mid
router.use('/blogEdit', (req, res) => {
  // res.send()
  // console.log("what is req:",req)
  console.log('what is req.body:', req.body)
  console.log('what is req.param:', req.params)
  console.log('what is req.quert:', req.query)
  res.json({ message: 'success' })
})
// app.use('/', router)
app.get('/', function (req, res) {
  let data = req.query;
  if (req.protocol === 'https') {
    res.status(200).send('This is https visit!')
  } else {
    res.status(200).send(data);
  }
})

// use nodejs reptile 

// var reptile = require('./reptile.js');
//  app.use('/reptile', function(req,res){
//   console.log("fadf");
//   res.send({"name":"reptile"})
//  });

let reptile=require('./app/view/js/reptile.js');
app.get('/reptile',reptile);

// let server = app.listen(3000, () => {
//     let host = server.address().address
//     let port = server.address().port
//     console.log('Example app listening at http://%s:%s', host, port)
// })

// let fs=require('fs')
// let tls=require('tls')
// let forceSSL=require('express-force-ssl')
// ssl
// let sslOptions = {
//     key:fs.readFileSync('./app/view/ssl/private.pem'),
//     cert:fs.readFileSync('./app/view/ssl/ca.cer'),
// }
// let server=tls.createServer(sslOptions,()=>{
//     console.log("tls")
// })
// server.listen(8000,()=>{
//     console.log("success")
// })
let http = require('http');
// let https = require('https')
http.createServer(app).listen(4000);
// https.createServer(sslOptions, app).listen(8443)
// let secureServer=https.createServer(sslOptions,app)
// app.use(forceSSL)
// secureServer.listen(443)
// nginx
// openssl req -new -sha256 -key domain.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:komolei.cn,DNS:www.komolei.cn")) > domain.csr
// server {
// server_name www.komolei.cn komolei.cn

// location ^~ /.well-known/acme-challenge/ {
//     alias /home/xxx/www/challenges/
//     try_files $uri =404
// }

// location / {
//     rewrite ^/(.*)$ https://komolei.cn/$1 permanent
// }
// }

// acme.sh  --issue  -d komolei.cn -d www.komolei.cn  --webroot  /home/wwwroot/komolei.cn/

// acme.sh  --installcert  -d  komolei.cn   \
// --key-file   /usr/local/nginx/ssl/komolei.cn.key \
// --fullchain-file /usr/local/nginx/ssl/komolei.cn.cer \
// --reloadcmd  "service nginx force-reload"

// export Ali_Key="LTAIEkP5nouWbvWi"
// export Ali_Secret="IdBwzxUo2OBPSxtAxnVv4urd48LNhs"
// acme.sh --issue --dns dns_ali -d komolei.cn -d www.komolei.cn

// ./acme.sh  --installcert -d komolei.cn \
// --key-file /root/komolei/ssl/komolei.cn.key \
// --fullchain-file /root/komolei/ssl/komolei.cn.cer \
// --reloadcmd "service nginx force-reload"

// curl --trace output.txt www.komolei.cn
