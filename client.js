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

var feeVal = 100000;

function loopTest () {                    //  create a loop function
  setTimeout(function () {                //  call a 30s setTimeout when the loop is called
    web3.eth.getAccounts((err, accounts) => {
      oracleContract.deployed()
      .then((oracleInstance) => { 
    
        //Unlock the account.  The account has to be the contract owner
        web3.eth.personal.unlockAccount(accounts[1], pw, 86400);     
        // Our promises
        const oraclePromises = [
          oracleInstance.getMarketCap(),  // Get currently stored BTC Cap
          oracleInstance.updateMarketCap({from: accounts[1], value: feeVal}),  // Request oracle to update the information
          oracleInstance.getBalance(),
          oracleInstance.getOracleFee()
        ]
    
        // Map over all promises
        Promise.all(oraclePromises)
        .then((result) => {
          
          //Display Date format
          var date = new Date( result[0][6] * 1000);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();
          var seconds = "0" + date.getSeconds();
          var formattedTime = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          
          console.log('Market Cap Values: ' + 'Market Cap: ' + 
            result[0][0]+ ' Market Cap 24hr: ' + 
            result[0][1]+ ' Market Cap %: ' + 
            result[0][2]+ ' Active Currencies: ' + 
            result[0][3]+ ' Active Assets: ' + 
            result[0][4]+ ' Active Markets: '  + 
            result[0][5] + ' Last Update: '  + formattedTime)

          feeVal = result[3];
          console.log('Fee: ' + feeVal); 
          console.log('Balance: ' + result[2])
          console.log('Runs: ' + intRuns++)
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
    if (intRuns < 50000) {      //  if the counter < 50000, call the loop function
      loopTest();               //  ..  again which will trigger another 
    }                           //  ..  setTimeout()
  }, 30000)
}

loopTest();                    //  start the loop
