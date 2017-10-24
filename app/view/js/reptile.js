let express = require('express');
let router = express.Router();
// 添加依赖
let request = require('request');
let cheerio = require('cheerio');
/* GET users listing. */
let rp = require('request-promise');

// Use node.fs module to save crawl data,the format is json
const fs = require('fs');

router.get('/reptile', (req, res) => {
	let param = req.query || req.params;
	let url = 'https://www.ebay.com.au/usr/mars_performance?_trksid=p2047675.l2559';
	let json = {};
	let reptileData = [];
	let rpOption = {
		uri: url,
		transform: body => cheerio.load(body),
	}
	let arrData = rp(rpOption).then($ => {
		let aLink = $("div .item_image");
		let aLinks = [];
		aLink.each((i, el) => {
			aLinks[i] = $(el).children().first().children().first().attr("href");
		})
		return aLinks;
	}).then(aLinks => {
		console.log("aLinks is:", aLinks instanceof Array, aLinks, "\n");
		let ob = {};
		let arr = [];
		async function waitData(urls) {
			try {
				for (const url of urls) {
					let value = await getData(url)
					arr.push(value);
					console.log("arr is that:", arr);
				}
			} catch (error) {
				console.log("error is:", error, "in the async function");
			}

			// try {
			// 	let value = await getData(url);
			// 	// let value1= await getData(url);
			// 	// let value2= await getData(url);
			// 	// let value3= await getData(url);
			// 	// let value4= await getData(url);
			// 	console.log("value:", value);
			// 	arr.push(value);
			// 	return arr;
			// }
			// catch (err) {
			// 	console.log("err is:", err);
			// }
			// res.send(arr.toString());
			res.json(arr);
			fs.writeFile(__dirname + '/data/data.json', JSON.stringify(arr), (err) => { if (err) throw err; console.log("write success"); })

		}
		let getData = (url) => {
			let option = {
				uri: url,
				transform: $ => cheerio.load($),
			}
			let rpPromise = rp(option).then($ => {
				ob = {};
				let qtySubTxt1 = $('.w2b-sgl').text();
				let qtySubTxt = $('.vi-qtyS').text();
				let title = $('#itemTitle').text();
				ob.title = title;
				ob.sold = qtySubTxt;
				console.log("text:", qtySubTxt, "\n");
				return ob;
				// return ob;
			})
			return rpPromise;
		}
		waitData(aLinks);
		// aLinks.map((i, el) => {
		// 	console.log("el is:", el, "i is", i);
		// 	// getData(i);
		// 	waitData(i);
		// 	// let option = {
		// 	// 	uri: i,
		// 	// 	transform: $ => cheerio.load($),
		// 	// }
		// 	// let rpData = () => rp(option).then($ => {
		// 	// 	let qtySubTxt = $('.w2b-sgl').text();
		// 	// 	console.log("text:", qtySubTxt);
		// 	// 	ob.data = qtySubTxt;
		// 	// 	// arr.push(ob);
		// 	// 	console.log("arr is:", arr);
		// 	// 	// return JSON.stringify(arr);
		// 	// })
		// })

	})


	// let firstData = request(url, (error, response, body) => {
	// 	if (!error && response.statusCode == 200) {
	// 		let $ = cheerio.load(body);
	// 		let aLength = $("div .item_image");
	// 		let money = $(".price.fl.bold").text();
	// 		// let a=$("div .item_image").children().first().children().first().attr("href");
	// 	} else {
	// 		console.log("gg");
	// 	}
	// })

	// for (let index = 0; index < aLength.length; index++) {
	// 	let a = $("div .item_image").eq(index).children().first().children().first().attr("href");
	// 	console.log("result:", a, index, "\n");
	// 	console.log("first index:", index);

	// 	let GetData = () => {
	// 		return new Promise((resolve, reject) => {
	// 			request(a, (error, repsonse, body) => {
	// 				resolve(body);
	// 				if (error) { reject(error) };
	// 				// if (!error && response.statusCode == 200) {
	// 				// 	let $ = cheerio.load(body);
	// 				// 	let qtySubTxt1 = $('#qtySubTxt').text();
	// 				// 	let qtySubTxt = $('.w2b-sgl').text();
	// 				// 	console.log("text:", qtySubTxt);
	// 				// 	console.log("index is:", index);
	// 				// 	json.data = qtySubTxt;
	// 				// 	reptileData.push(json);
	// 				// 	// reptileData[index] = json;
	// 				// 	console.log("reptileData:", JSON.stringify(reptileData));
	// 				// }
	// 				// else {
	// 				// 	console.log("gg");
	// 				// }
	// 			})
	// 		})

	// 	}

	// 	async function asyncGetData() {
	// 		try {
	// 			let value = await GetData();
	// 			return value;
	// 		}
	// 		catch (err) {
	// 			console.log("error is", err);
	// 		}
	// 	}
	// 	asyncGetData().then(body => {
	// 		let $ = cheerio.load(body);
	// 		let qtySubTxt = $('.w2b-sgl').text();
	// 		console.log("text:", qtySubTxt);
	// 		console.log("index is:", index);
	// 		json.data = qtySubTxt;
	// 		reptileData.push(json);
	// 		// reptileData[index] = json;
	// 		console.log("reptileData:", JSON.stringify(reptileData));
	// 	}).catch(err => console.log("err is:", err))
	// }
	// res.json(reptileData);
});
module.exports = router;