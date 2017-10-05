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
// let formData = 'client_id=517ea4027af95e1823b1&client_secret=fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d&code=' + data.code
app.get('/github', (req, res) => {
  let firstUrl = 'https://github.com/login/oauth/authorize?client_id=517ea4027af95e1823b1&state=1314&redirect_uri=https://komolei.cn/github'
  fetch(firstUrl, {method: 'get'})
    .then(response => {
      typeof response;console.log('response:', response); return response;})
    .then(data => {
      console.log('first request:', data, '\n');return data})
    .then(data => {
      console.log('callback success')})
    .then(data => {
      console.log('first request:', data, '\n');return data})
    .then(data => {
      console.log('callback success')
      // let data = req.query
      console.log("github data'code:", data.code)
      let formData = {
        client_id: '517ea4027af95e1823b1',
        client_secret: 'fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d',
        code: data.code,
        redirect_uri: 'https://komolei.cn/github'
      }
      let url = 'https://github.com/login/oauth/access_token'
      let init = {
        method: 'POST',
        // mode: 'cors',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json'
        }
      }
      console.log('init', init)
      // let request=new Request(url,init);  
      // console.log("request is what",request)

      let formData1 = 'https://github.com/login/oauth/access_token?client_id=517ea4027af95e1823b1&client_secret=fc3afd9cf734640f4617d9fde374a1dbe3ebbc6d&code=' + data.code + 'redirect_uri=https://komolei.cn'
      // fetch(url, init)

      console.log('formData:', formData)

      // fetch(formData1, {method: 'get',headers: {
      //     'Content-type': 'application/json'
      // }})

      fetch(url, init).then(response => {
        console.log('first response is:', typeof response, 'sdfadfga', '\n')
        //  console.log('json parse', JSON.parse(response))
        res.send(response);return response}).then(data => {
        console.log('request success', data)
        let info = data
        console.log('dfaf:', info, '\n', typeof info)
        let url2 = 'https://api.github.com/user?access_token=' + info.access_token
        fetch(url2, {method: 'get'}).then(response => {
          console.log('second response is:', response); return response.json()}).then(data => {
          let userInfo = data.query
          res.send(userInfo)
        })
      }).catch(err => console.log('err: ', err))
    })
})

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
  if (req.protocol === 'https') {
    res.status(200).send('This is https visit!')
  }else {
    res.status(200).send('This is http visit!')
  }
})

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
let http = require('http')
// let https = require('https')
http.createServer(app).listen(4000)
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
