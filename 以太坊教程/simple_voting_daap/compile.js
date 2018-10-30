var Web3 = require('web3');
// var fs = require('fs');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

web3.isConnected();

var sourceCode = fs.readFileSync('Voting.sol').toString();

solc = require('solc');

//solc进行编译
compiledCode = solc.compile(sourceCode);

//编译后的ABI
var abi = JSON.parse(compiledCode.contracts[':Voting'].interface);

//编译后的字节码
var byteCode = compiledCode.contracts[':Voting'].bytecode;

var VotingContract = web3.eth.contract(abi);

var deployTxObj = {data: byteCode, from: web3.eth.accounts[0], gas: 3000000}; // from：部署合约的账户 gas：部署合约花费的gas

//将合约部署到区块链
var contractInstance = VotingContract.new(['Alice', 'Bob', 'Cary'], deployTxObj); //第一个参数是候选者数组,合约构造器函数的参数

var contractAddress = contractInstance.address;

//投票
contractInstance.vote('Alice', {from: web3.eth.accounts[0]}); //调用合约的函数
contractInstance.totalVotesFor('Alice').toString();


contractInstance.totalVotesFor.call('Bob').toString(); // 只是view，不需要花费gas
contractInstance.totalVotesFor('Bob').toString();//调用


contractInstance.vote.sendTransaction('Cary', {from: web3.eth.accounts[0]}); //发送交易去函数调用
contractInstance.totalVotesFor.call('Cary').toString();


