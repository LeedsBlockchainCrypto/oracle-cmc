pragma solidity ^0.4.19;


contract CMCOracle {
    // Contract owner
    address owner;
    
    // BTC Marketcap Storage
    uint public marketCap;
    uint256 public oracleFee;
    
    mapping (address => uint) public purchasers;

    // Callback function
    event CallbackMarketCap();

    function CMCOracle() public {
        owner = msg.sender;
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
}