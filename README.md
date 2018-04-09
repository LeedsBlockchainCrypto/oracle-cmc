# oracle-cmc

This is a simple example of how an oracle can work.  It just injects the CoinMarketCap MarketCap into the CMCOracle contract

I have 2 accounts (accoutns[0] and accounts[1]) in my wallet 

accounts[0] is the owner of the contract therefore it can be the only account that can call the setMarketCap function in CMCOracle.sol.

So, to work the oracle.js must be running in the background using the geth node of accounts[0]

Anyone else can call it using client.js

I've basically taken this turorial and modified it so it worked with the rinkeby development node not testrpc

https://kndrck.co/posts/ethereum_oracles_a_simple_guide/


Order of run

1. setvaliduser.js  - sends a list of valid addresses that can be used along with a flag saying if valid or not (solidity will always say an address is valid in a mapping because it will use 0, so you have to have the isValid flag)
2. oracle.js - this is the main set of funcitons.  Run by the owner on the geth instance that has the owner account on it (account[0] in my case)
3. cleint.js - can be run from any geth instance and as long as the address is valid and has been put in the setvaliduser.js list it will work
4.withdraw.js - Alows you to withdraw ether from the contract account to the owner account.  If you dont ahve the withdraw function in the contact then the ether wil be stuck in the contract account forever.  Useful when you want to update as well (do it before you -reset in truffle)

All of this will work on the testrpc instance, however to do a ful test you need to be on proper instance like rinkeby to check the ownershi aspects



