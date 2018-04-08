var fetch = require('fetch')
var OracleContract = require('./build/contracts/CMCOracle.json')
var contract = require('truffle-contract')

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


//Get the password from the command line args.  e.g. node oracle.js ~/Development/pw.txt
var fs = require('fs');
var pw = '';
fs.readFile(process.argv[2], 'utf8', function (err, data) {
  if (err) throw err;
  pw = data;
});

console.log('Starting the Oracle ......');
    

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

// Get accounts from web3
web3.eth.getAccounts((err, accounts) => {
  oracleContract.deployed()
  .then((oracleInstance) => {
    // Watch event and respond to event
    // With a callback function  
    
    //Unlock the account.  The account has to be the contract owner 
    web3.eth.personal.unlockAccount(accounts[0], pw);
  
    oracleInstance.CallbackMarketCap()
    .watch((err, event) => {
      // Fetch data and update it into the contract
      console.log('Fetching the Market Cap');
      fetch.fetchUrl('https://api.coinmarketcap.com/v1/global/', (err, m, b) => {
        const cmcJson = JSON.parse(b.toString())
        const btcMarketCap = parseInt(cmcJson.total_market_cap_usd)

        // Send data back contract on-chain
        oracleInstance.setOracleFee(50000000000, {from: accounts[0]})
        oracleInstance.setMarketCap(btcMarketCap, {from: accounts[0]})
        console.log('Complete')
        console.log('Pay')
        console.log('Paid')
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
})