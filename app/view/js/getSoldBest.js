let express = require('express');
let router = express.Router();

let request = require('request');
let rp = require('request-promise');
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("waiting");
    let cheerio = require('cheerio');
    let url = "https://www.ebay.com.au/sch/Vehicle-Parts-Accessories/131090/m.html?_nkw=&_armrs=1&_from=&_ssn=mars_performance&_sop=12&_ipg=200&rt=nc";
    let url1 = "https://www.ebay.com.au/sch/Vehicle-Parts-Accessories/131090/m.html?_nkw=&_armrs=1&_from=&_ssn=mars_performance&_sop=12&_ipg=200&rt=nc"
    let arr = [];
    let ob = { name: '', value: '' };
    let options = {
        uri: url1,
        transform: body => cheerio.load(body)
    }
    let getData = ($) => {
        console.log("getData successfully");
        // ob = {};
        // let title = $('.lvtitle').text();
        // let title = $('li').find($('.lvtitle')).text();
        let titleLength = $('li').find($('.lvtitle')).length;
        console.log("titleLength:", titleLength);
        for (let i = 0; i < titleLength; i++) {
            ob = {};
            let title = $('li').find($('.lvtitle')).eq(i).text();
            let val = $('li').has('.lvtitle').eq(i).find($('.hotness-signal.red')).text();
            if (!val.length || !title.length) continue;
            ob.name = title;
            ob.value = val;
            arr.push(ob);
            console.log("finally result is:", arr);
        }
        fs.writeFileSync(__dirname + '/data.json', JSON.stringify(arr), err => {
            if (err) throw err;
            console.log("the data has been saved");
        });
        // let val = $('li').find($('.lvtitle')).find($(".hotness-signal.red")).text() ? $('li').find($('.lvtitle')).find($(".hotness-signal.red")).text() : "";
        // console.log("val", val);
        // ob.name = title;
        // ob.value = val;
        // // console.log("ob:", ob);
        // arr.push(ob);
        // console.log("array is:", arr);
        // return ob;
    };
    let setData = async (el) => await getData(el);
    let fs = require("fs");
    rp(options).then(($) => {
        let ulContent = $('<ul id="ListViewInner"></ul>').find('li');
        let ulBox = cheerio.load(ulContent, {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: false,
            decodeEntities: true
        });
        // fs.writeFileSync(__dirname + '/ulContent.txt', $, err => {
        //     if (err) throw err;
        //     console.log("the data has been saved");
        // });
        return $;
        // let title = $('<ul id="ListViewInner"></ul>').find('li').children().find($('.lvtitle')).text();
        // let value = $('<ul id="ListViewInner"></ul>').find('li').children().find($('.hotness-signal.red')).text();
        // console.log("liLength: is:", ulContent instanceof Array, typeof ulContent, ulContent instanceof Object);
        // let ulBox = cheerio.load(ulContent.toString());
        // for (let el of Object.keys(ulContent)) {
        //     // setData($)
        //     // el = cheerio.load(el);
        //     setData($)
        // }
        // fs.writeFileSync(__dirname + '/data.json', JSON.stringify(arr), err => {
        //     if (err) throw err;
        //     console.log("the data has been saved");
        // });
    }).then(($) => {
        // fs.writeFileSync(__dirname + '/ulBox.txt', $, err => {
        //     if (err) throw err;
        //     console.log("the data has been saved");
        // });
        setData($);
    }).catch(err => console.log("err is:", err));

    // res.json(arr);
    // res.render('index', { title: 'Express' });
});

module.exports = router;