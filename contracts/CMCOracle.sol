pragma solidity ^0.4.21;

import "./ownable.sol";


contract CMCOracle is Ownable {
    
    //Valid Users
    struct KYC{
        string fName;
        string lName;
        bool isValid;
    }

    mapping (address => KYC) kyc;
    address[] public validKYCAccts;
    
    // BTC Marketcap Storage
    struct MarketCapVals {
        uint marketCap;
        uint marketCap24;
        uint marketCappercentage;
        uint activeCurrencies;
        uint activeAssets;
        uint activeMarkets;
        uint lastUpdate;
    }

    MarketCapVals[] marketValsStructs;

    uint256 public oracleFee;
    
    // Callback function
    event CallbackMarketCap();

    function CMCOracle() public {
        owner = msg.sender;

        MarketCapVals memory marketCapValsStruct = MarketCapVals(0,0,0,0,0,0,0);
        marketValsStructs.push(marketCapValsStruct);
    }
    
    function () public payable {
    } 
        
    function setMarketCap(uint _marketCap, uint _marketCap24, uint _marketCappercentage, uint _activeCurrencies, uint _activeAssets, uint _activeMarkets,uint _lastUpdate) external payable onlyOwner {
        
        //MarketCapVals memory marketCapVals = MarketCapVals(_marketCap,_marketCap24,_marketCappercentage,_activeCurrencies,_activeAssets,_activeMarkets,_lastUpdate);
        
        marketValsStructs[0].marketCap = _marketCap;
        marketValsStructs[0].marketCap24 = _marketCap24;
        marketValsStructs[0].marketCappercentage = _marketCappercentage;
        marketValsStructs[0].activeCurrencies = _activeCurrencies;
        marketValsStructs[0].activeAssets = _activeAssets;
        marketValsStructs[0].activeMarkets = _activeMarkets;
        marketValsStructs[0].lastUpdate = _lastUpdate;

    }
    
    function withdrawEther() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function setValidPurchaser(address _validAddress, string _fName, string _lName, bool _isValid) external payable onlyOwner {
        
        KYC storage kycClient = kyc[_validAddress];
        
        kycClient.fName = _fName;
        kycClient.lName = _lName;
        kycClient.isValid = _isValid;

        validKYCAccts.push(_validAddress) - 1;
    }

    function getValidPurchaser(address _address) external view onlyOwner returns (string, string) {
        return (kyc[_address].fName, kyc[_address].lName);
    }

    function countValidPurchasers() view external onlyOwner returns (uint) {
        return validKYCAccts.length;
    }

    function isValidPurchaser(address _validAddress) private view onlyOwner returns (bool) {
        
        return (kyc[_validAddress].isValid);
    }

    function setOracleFee(uint256 fee) external onlyOwner {
        oracleFee = fee;
    }
    
    function updateMarketCap() public payable {        
        if (msg.value < oracleFee) return;     
        // Calls the callback function         
        emit CallbackMarketCap();              
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMarketCap() public view returns(uint v1, uint v2, uint v3, uint v4, uint v5, uint v6, uint v7) {
        
        if(!isValidPurchaser(msg.sender)) return;
                
        return(marketValsStructs[0].marketCap, 
            marketValsStructs[0].marketCap24,
            marketValsStructs[0].marketCappercentage, 
            marketValsStructs[0].activeCurrencies,  
            marketValsStructs[0].activeAssets,  
            marketValsStructs[0].activeMarkets, 
            marketValsStructs[0].lastUpdate);
    }
}