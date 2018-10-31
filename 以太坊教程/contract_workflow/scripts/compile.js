const fs = require('fs-extra');
const solc = require('solc');
const path = require('path');

//cleanup
const compiledDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

//compile
const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol');
const contractSource = fs.readFileSync(contractPath, 'utf-8');

const compileResult = solc.compile(contractSource, 1); //参数给1，表示启用solc的编译优化器  contracts属性包含了所有找到的合约

//check errors  在编译完成之后就检查error，让它能够在出错时直接抛出错误，可读性更好的错误提示
if (Array.isArray(compileResult.errors) && compileResult.errors.length) {
	throw new Error(compileResult.errors[0]);
}

// console.log(compileResult);

// save to disk
Object.keys(compileResult.contracts).forEach(name => {
	let contractName = name.replace(/^:/, '');
	let filePath = path.resolve(__dirname, '../compiled', `${contractName}.json`);
	fs.outputJsonSync(filePath, compileResult.contracts[name]);
	console.log(`save compiled contract ${contractName} to ${filePath}`);
});
