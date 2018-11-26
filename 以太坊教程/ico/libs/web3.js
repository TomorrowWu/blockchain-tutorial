import Web3 from 'web3';

const ip = require('../ip.json');

let web3;

// if browser enviroment & Metamask exists
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	// web3 = new Web3(window.web3.currentProvider);
	web3 = new Web3(new Web3.providers.HttpProvider(ip));
} else {
	web3 = new Web3(new Web3.providers.HttpProvider(ip));
}

export default web3;
