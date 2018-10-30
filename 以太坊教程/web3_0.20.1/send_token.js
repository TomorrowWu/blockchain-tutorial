var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var _from = web3.eth.accounts[0];
var _to = web3.eth.accounts[1];
var amount = 50000;

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

//_to,amount 调用合约的参数
// {from:_from,to:,value:} 向合约账户发的交易,转以太币等
contractInstance.send(_to, amount, {from: _from}, (err, res) => {
	if (err)
		console.log("Error: ", err);
	else
		console.log("Result: ", res.toString());
});
