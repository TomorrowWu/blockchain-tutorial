// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '39.105.42.197',   //39.105.42.197
      port: 18545,  //9545
      network_id: '*', // Match any network id
      gas: 470000, //如果你没有指定 2_deploy_contracts.js gas 值为 290000，migration 就会采用默认值 470000.
      //from: your address //使用你指定的地址来部署和交互
      // from:'0xfcdd972bcf5a10f2ac9209eeaee68dd0a65d9a7f',
      gasPrice: 1000000
    }
  }
}
