const path = require('path');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// 1. 拿到 bytecode
const constractPath = path.resolve(__dirname, '../compiled/Car.json');
const {interface, bytecode} = require(constractPath);

// console.log('interfece: ',interface);
// console.log('bytecode: ',bytecode);

(async () => {
	// 2. 获取钱包里面的账户
	let accounts = await web3.eth.getAccounts();
	// 3. 创建合约实例并且部署
	console.time('合约部署耗时');
	let result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ["BMW"]})
		.send({from: accounts[0], gas: '1000000'});
	console.timeEnd('合约部署耗时');
	console.log('合约部署成功: ', result.options.address);
})();
