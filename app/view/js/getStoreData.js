let express = require('express');
let router = express.Router();
let request = require('request');
let rp = require('request-promise');
let fs = require('fs');
router.get('/', (req, res, next) => {
    console.log('waiting a monent');
    let cheerio = require('cheerio');
    let url1 = 'http://stores.ebay.com.au/Mars-Performance-Warehouse/_i.html?_nkw=&submit=Search&_sid=205080723';
    let url = 'http://stores.ebay.com.au/Mars-Performance-Warehouse/_i.html?_nkw=&submit=Search&_sid=205080723';
    let arr = [];
    let ob = {};
    let options = {
        uri: url,
        transform: body => cheerio.load(body),
    }
    let getData = (item) => {
        let option = {
            uri: item,
            transform: body => cheerio.load(body)
        }
        rp(option).then($ => $).then($ => {
            ob = {};
            let title = $('.it-ttl').text();
            let price = $('.vi-qtyS').text();
            ob.title = title;
            ob.price = price;
            arr.push(ob);
            return arr;
        }).then(arr => {
            fs.writeFileSync(__dirname + 'storeData1.json', JSON.stringify(arr), err => {
                if (err) throw err;
                console.log("the store data has been saved");
            })
            return arr;
        }).finally(arr => res.json(arr)).catch(err => console.log(err))

    }

    let setData = async (item) => {
        await getData(item);
    }
    rp(options).then($ => {
        let aObLength = $('.picture.camera').length;
        let aLinks = [];
        let aLink = $('.picture.camera');
        aLink.each((index, el) => {
            aLinks[index] = $(el).children().find('a').attr('href');
        })
        return aLinks;
        let aOb = $('td .picture.camera').children().find('a').attr('href');
        console.log("aOb type is:", typeof aOb, aOb instanceof Array, aOb);

    }).then(aLinks => {
        for (const item of aLinks) {
            setData(item);
        }
        fs.writeFileSync(__dirname + 'storeData.json', JSON.stringify(arr), err => {
            if (err) throw err;
            console.log("the store data has been saved");
        })
    })
});
module.exports = router;
