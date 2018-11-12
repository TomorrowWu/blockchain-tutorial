// Import the page's CSS. Webpack will know what to do with it.
import "../styles/app.css";
// Import libraries we need.
import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'
import ecommerce_store_artifacts from '../../build/contracts/EcommerceStore.json'

var EcommerceStore = contract(ecommerce_store_artifacts);

const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');

const ipfs = ipfsAPI({host: '39.105.42.197', port: '5001', protocol: 'http'});

window.App = {
	start: function () {
		var self = this;
		
		EcommerceStore.setProvider(web3.currentProvider);
		renderStore();
		
		var reader;
		
		$("#product-image").change(function (event) {
			const file = event.target.files[0];
			reader = new window.FileReader();
			reader.readAsArrayBuffer(file)
		});
		
		$("#add-item-to-store").submit(function (event) {
			const req = $("#add-item-to-store").serialize();
			let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
			let decodedParams = {};
			Object.keys(params).forEach(function (v) {
				decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
			});
			saveProduct(reader, decodedParams);
			event.preventDefault();
		});
	}
	
};

function renderStore() {
	EcommerceStore.deployed().then(function (i) {
		i.getProduct.call(1).then(function (p) {
			$("#product-list").append(buildProduct(p));
		});
		i.getProduct.call(2).then(function (p) {
			$("#product-list").append(buildProduct(p));
		});
	});
}

function buildProduct(product) {
	let node = $("<div/>");
	node.addClass("col-sm-3 text-center col-margin-bottom-1");
	node.append("<img src='https://ipfs.io/ipfs/" + product[3] + "' width='150px' />");
	node.append("<div>" + product[1] + "</div>");
	node.append("<div>" + product[2] + "</div>");
	node.append("<div>" + product[5] + "</div>");
	node.append("<div>" + product[6] + "</div>");
	node.append("<div>Ether " + product[7] + "</div>");
	return node;
}

function saveImageOnIpfs(reader) {
	return new Promise(function (resolve, reject) {
		const buffer = Buffer.from(reader.result);
		ipfs.add(buffer)
			.then((response) => {
				console.log(response);
				resolve(response[0].hash);
			}).catch((err) => {
			console.error(err);
			reject(err);
		})
	})
}

function saveTextBlobOnIpfs(blob) {
	return new Promise(function (resolve, reject) {
		const descBuffer = Buffer.from(blob, 'utf-8');
		ipfs.add(descBuffer)
			.then((response) => {
				console.log(response);
				resolve(response[0].hash);
			}).catch((err) => {
			console.error(err);
			reject(err);
		})
	})
}

function saveProduct(reader, decodedParams) {
	let imageId, descId;
	saveImageOnIpfs(reader).then(function (id) {
		imageId = id;
		saveTextBlobOnIpfs(decodedParams["product-description"]).then(function (id) {
			descId = id;
			saveProductToBlockchain(decodedParams, imageId, descId);
		})
	})
}

function saveProductToBlockchain(params, imageId, descId) {
	console.log(params);
	let auctionStartTime = Date.parse(params["product-auction-start"]) / 1000;
	let auctionEndTime = auctionStartTime + parseInt(params["product-auction-end"]) * 24 * 60 * 60;
	
	EcommerceStore.deployed().then(function (i) {
		i.addProductToStore(params["product-name"], params["product-category"], imageId, descId, auctionStartTime,
			auctionEndTime, web3.toWei(params["product-price"], 'ether'), parseInt(params["product-condition"]), {
				from: web3.eth.accounts[0],
				gas: 440000
			}).then(function (f) {
			console.log(f);
			$("#msg").show();
			$("#msg").html("Your product was successfully added to your store!");
		})
	});
}

window.addEventListener('load', function () {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		// console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
		// Use Mist/MetaMask's provider
		// window.web3 = new Web3(web3.currentProvider);
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://39.105.42.197:8545"));
	} else {
		// console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://39.105.42.197:8545"));
	}
	
	App.start();
});
