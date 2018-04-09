

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

var intCalls = 1;

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
    web3.eth.personal.unlockAccount(accounts[0], pw, 86400);
  
     oracleInstance.CallbackMarketCap()
    .watch((err, event) => {
      // Fetch data and update it into the contract
      console.log('Fetching the Market Cap');
      fetch.fetchUrl('https://api.coinmarketcap.com/v1/global/', (err, m, b) => {
        const cmcJson = JSON.parse(b.toString())
        const marketCap = parseInt(cmcJson.total_market_cap_usd)
        const marketCap24 = parseInt(cmcJson.total_24h_volume_usd)
        const marketCappercentage = parseInt(cmcJson.bitcoin_percentage_of_market_cap)
        const activeCurrencies = parseInt(cmcJson.active_currencies)
        const activeAssets = parseInt(cmcJson.active_assets)
        const activeMarkets = parseInt(cmcJson.active_markets)
        const lastUpdate = parseInt(cmcJson.last_updated)
        
        oracleInstance.setMarketCap(marketCap, marketCap24, marketCappercentage, activeCurrencies, activeAssets, activeMarkets, lastUpdate, {from: accounts[0], gas: 300000, value: 100000})
        
        //Display Date format
        var date = new Date( lastUpdate * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate()
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                
        console.log("Number of calls since last reset: " + intCalls++)
        console.log('Market Cap Values: ' + 'Market Cap: ' + 
          marketCap + ' Market Cap 24hr: ' + 
          marketCap24 + ' Market Cap %: ' + 
          marketCappercentage + ' Active Currencies: ' + 
          activeCurrencies + ' Active Assets: ' + 
          activeAssets + ' Active Markets: '  + 
          activeMarkets + ' Last Update: '  + formattedTime)
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
})