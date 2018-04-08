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

var intRuns = 1;

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


function loopTest () {                    //  create a loop function
  setTimeout(function () {                //  call a 30s setTimeout when the loop is called
    web3.eth.getAccounts((err, accounts) => {
      oracleContract.deployed()
      .then((oracleInstance) => { 
    
        //Unlock the account.  The account has to be the contract owner
        web3.eth.personal.unlockAccount(accounts[1], pw, 86400); 
    
        // Our promises
        const oraclePromises = [
          oracleInstance.marketCap(),  // Get currently stored BTC Cap
          oracleInstance.updateMarketCap({from: accounts[1], value: 50000000000}),  // Request oracle to update the information
          oracleInstance.getBalance()
        ]
    
        // Map over all promises
        Promise.all(oraclePromises)
        .then((result) => {
          console.log('Old Market Cap: ' + result[0])
          console.log('Requesting Oracle to update CMC Information...')
          console.log('Balance: ' + result[2])
          console.log('Runs: ' + intRuns)
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
    intRuns++;                  //  increment the counter
    if (intRuns < 50000) {      //  if the counter < 50000, call the loop function
      loopTest();               //  ..  again which will trigger another 
    }                           //  ..  setTimeout()
  }, 30000)
}

loopTest();                    //  start the loop
