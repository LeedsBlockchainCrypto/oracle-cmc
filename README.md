# oracle-cmc

This is a simple example of how an oracle can work.  It just injects the CoinMarketCap MarketCap into the CMCOracle contract

I have 2 accounts (accoutns[0] and accounts[1]) in my wallet 

accounts[0] is the owner of the contract therefore it can be the only account that can call the setBTCCap function in CMCOracle.sol.

So, to work the oracle.js must be running in the background using the geth node of accounts[0]

Anyone else can call it using client.js

I've basically taken this turorial and modified it so it worked with the rinkeby development node not testrpc

https://kndrck.co/posts/ethereum_oracles_a_simple_guide/
