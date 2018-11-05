// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*', // Match any network id
      gas: 470000, //如果你没有指定 2_deploy_contracts.js gas 值为 290000，migration 就会采用默认值 470000.
      //from: your address //使用你指定的地址来部署和交互
      gasPrice: 1000000000
    }
  }
}
