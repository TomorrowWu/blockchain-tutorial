var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var args = process.argv.slice(2);

if (!args || args.length != 2) {
	console.log("Parameter length must be 2");
	return;
}

//有密码，geth创建的
var _from = web3.eth.accounts[2];

var _to = args[0];
var amount = args[1];

var abi = [{
	"constant": true,
	"inputs": [],
	"name": "minter",
	"outputs": [{"name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"name": "", "type": "address"}],
	"name": "balances",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"name": "receiver", "type": "address"}, {"name": "amount", "type": "uint256"}],
	"name": "mint",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"name": "receiver", "type": "address"}, {"name": "amount", "type": "uint256"}],
	"name": "send",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "from", "type": "address"}, {
		"indexed": false,
		"name": "to",
		"type": "address"
	}, {"indexed": false, "name": "amount", "type": "uint256"}],
	"name": "Sent",
	"type": "event"
}];

var CoinContract = web3.eth.contract(abi);
var contractAddress = "0x62F0dCf8faB427C3187a417FdAa66A6B612CC99C";
var contractInstance = CoinContract.at(contractAddress);

web3.personal.unlockAccount(_from, '123456', {from: _from}, (err, res) => {
	if (err)
		console.log("Error: ", err);
	else
		contractInstance.send(_to, amount, {from: web3.eth.accounts[0]}, (err, res) => {
			if (err)
				console.log("Error: ", err);
			else
				console.log("Result: ", res);
		});
});

// contractInstance.send(_to,amount,{from: _from},(err,res)=>{
// 	if (err)
// 		console.log("Error: ", err);
// 	else
// 		console.log("Result: ", res);
// });
