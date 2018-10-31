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

const compileResult = solc.compile(contractSource, 1);

//check errors
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
