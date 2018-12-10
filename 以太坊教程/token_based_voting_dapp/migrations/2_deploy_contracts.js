// var ConvertLib = artifacts.require('./ConvertLib.sol')
// var MetaCoin = artifacts.require('./MetaCoin.sol')

var Voting = artifacts.require('./Voting.sol');

module.exports = function (deployer) {
  deployer.deploy(Voting, 10000, web3.toWei('0.01', 'ether'), ['Alice', 'Bob', 'Cary'])
};
