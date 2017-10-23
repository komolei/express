let express = require('express');
let router = express.Router();
// 添加依赖
let request = require('request');
let cheerio = require('cheerio');
/* GET users listing. */
let rp = require('request-promise');
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
		aLinks.map((i, el) => {
			console.log("el is:", el, "i is", i);
			let option = {
				uri: i,
				transform: $ => cheerio.load($),
			}
			let rpData = () => rp(option).then($ => {
				let qtySubTxt = $('.w2b-sgl').text();
				console.log("text:", qtySubTxt);
				ob.data = qtySubTxt;
				// arr.push(ob);
				console.log("arr is:", arr);
				// return JSON.stringify(arr);

			})
		})
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