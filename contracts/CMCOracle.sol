pragma solidity ^0.4.21;

import "./ownable.sol";


contract CMCOracle is Ownable {
    
    // BTC Marketcap Storage
    uint private marketCap;
    uint256 public oracleFee;
    
    mapping (address => uint) public purchasers;
    
    // Callback function
    event CallbackMarketCap();

    function CMCOracle() public {
        owner = msg.sender;
    }
    
    function () public payable {
    } 
        
    function setMarketCap(uint cap) external onlyOwner {
        marketCap = cap;
    }
    
    function withdrawEther() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function setOracleFee(uint256 fee) external onlyOwner {
        oracleFee = fee;
    }
    
    function updateMarketCap() public payable {        
        if (msg.value < oracleFee) return;     
        // Calls the callback function
        purchasers[msg.sender]++; 
        emit CallbackMarketCap();              
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}