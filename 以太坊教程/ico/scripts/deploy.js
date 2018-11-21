const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// 1. 拿到 bytecode
const contractPath = path.resolve(__dirname, '../compiled/ProjectList.json');
const {interface, bytecode} = require(contractPath);

(async () => {
	try {
		// 2. 获取钱包里面的账户
		let accounts = await web3.eth.getAccounts();
		// 3. 创建合约实例并且部署
		const result = await new web3.eth.Contract(JSON.parse(interface))
			.deploy({data: bytecode})
			.send({
				from: accounts[0],
				gas: 4712388,
				gasPrice: 100000000000
			});
		const contractAddress = result.options.address;
		// 4. write contract address to file
		const addressFile = path.resolve(__dirname, '../address.json');
		fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
		console.log('地址写入成功:', addressFile);
		// process.exit();
	} catch (e) {
		console.log('err:', e);
	}
})();
