var OracleContract = require('./build/contracts/CMCOracle.json')
var contract = require('truffle-contract')

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Truffle abstraction to interact with our
// deployed contract
var oracleContract = contract(OracleContract)
oracleContract.setProvider(web3.currentProvider)

// Dirty hack for web3@1.0.0 support for localhost testrpc
// see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof oracleContract.currentProvider.sendAsync !== "function") {
  oracleContract.currentProvider.sendAsync = function() {
    return oracleContract.currentProvider.send.apply(
      oracleContract.currentProvider, arguments
    );
  };
}

   
web3.eth.getAccounts((err, accounts) => {
  oracleContract.deployed()
  .then((oracleInstance) => { 

    // Our promises
    const oraclePromises = [
      oracleInstance.getmarketCap(),  // Get currently stored BTC Cap
      oracleInstance.oracleFee()  // Get currently stored BTC Cap
    ]

    // Map over all promises
    Promise.all(oraclePromises)
    .then((result) => {
      console.log('BTC Market Cap: ' + result[0][0])
      console.log('Oracle Fee: ' + result[1])
    })
    .catch((err) => {
      console.log(err)
    })
  })
  .catch((err) => {
    console.log(err)
  })
})