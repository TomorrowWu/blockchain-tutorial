// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'
// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts)
let candidates = { 'Alice': 'candidate-1', 'Bob': 'candidate-2', 'Cary': 'candidate-3' }

let host = 'http://localhost:8080/api'
// let host = 'http://39.105.42.197:8545'

window.voteForCandidate = function (candidate) {
  let candidateName = $('#candidate').val()
  try {
    $('#msg').html('Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.')
    $('#candidate').val('')
    Voting.deployed().then(function (contractInstance) {
      //webpack proxy 解决跨域问题
      //私链服务器设置
      contractInstance.vote(candidateName, { gas: 140000, from: web3.eth.accounts[0] })
        .then(function () {
          let div_id = candidates[candidateName]
          return contractInstance.totalVotesFor.call(candidateName).then(function (v) {
            $('#' + div_id).html(v.toString())
            $('#msg').html('')
          })
        })
    })
  } catch (e) {
    console.log(e)
  }
}

$(document).ready(function () {
  if (typeof web3 != 'undefined') {
    // console.warn('Using web3 detected from external source like Metamask')  // Use Mist/MetaMask's provider
    // window.web3 = new Web3(web3.currentProvider)
    window.web3 = new Web3(new
    Web3.providers
      .HttpProvider(host))
  } else {
    // console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new
    Web3.providers
      .HttpProvider(host))
  }
  
  Voting.setProvider(web3.currentProvider)
  let candidateNames = Object.keys(candidates)
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i]
    Voting.deployed().then(function (contractInstance) {
      contractInstance.totalVotesFor
        .call(name).then(function (v) {
        $('#' + candidates[name])
          .html(v.toString())
      })
    })
  }
});
