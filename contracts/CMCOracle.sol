pragma solidity ^0.4.19;

import "./ownable.sol";


contract CMCOracle {
    // Contract owner
    address owner;
    
    // BTC Marketcap Storage
    uint private marketCap;
    uint256 public oracleFee;
    
    mapping (address => uint) public purchasers;

    function CMCOracle() public {
        owner = msg.sender;
    }
    
    // Callback function
    event CallbackMarketCap();

    function () public payable {
    } 

    function updateMarketCap() public payable {
        
        if (msg.value < oracleFee) return;     
        // Calls the callback function
        purchasers[msg.sender]++; 
        CallbackMarketCap();              
    }

    function setMarketCap(uint cap) public {
        // If it isn't sent by a trusted oracle
        // a.k.a ourselves, ignore it
        require(msg.sender == owner);
        marketCap = cap;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setOracleFee(uint256 fee) public {
        // If it isn't sent by a trusted oracle a.k.a ourselves, ignore it
        require(msg.sender == owner);
        oracleFee = fee;
    }

    function withdrawEther() public {
        require(msg.sender == owner);
        msg.sender.transfer(this.balance);
    }
}