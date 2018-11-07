// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '39.105.42.197', //39.105.42.197
      port: 8545,
      network_id: '*', // Match any network id
      gas: 10000, //如果你没有指定 2_deploy_contracts.js gas 值为 290000，migration 就会采用默认值 470000.
      //from: your address //使用你指定的地址来部署和交互
      // from:'0x6f456036724F33E39EC842782cE8bcFb2954c952',
      gasPrice: 100
    },
    rinkeby: {
      host: '39.105.42.197', // Connect to geth on the specified
      port: 8545,
      from: '0x6f456036724F33E39EC842782cE8bcFb2954c952', // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
}
