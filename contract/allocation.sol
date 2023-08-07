// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
contract learn{
    address payable _master;
    string public projectID;
    address payable[] public addrs;
    uint8[] public percents;
    uint256 moneyAllocated;

    event eventConstruct(string ID, string projectID);
    event eventAllocate(string ID, string projectID, address indexed from, address indexed to, uint256 value);

    constructor(string memory _projectID, address payable[] memory _addrs, uint8[] memory _percents){
        _master = payable(0xEb5E992680dF053Cb73ebF34Af076684DF5b969e);
        projectID=_projectID;
        require(addrs.length == percents.length, "the addrs size must equal to percents' size");

        for(uint i = 0; i < _addrs.length; ++i){
            addrs.push(_addrs[i]);
            percents.push(_percents[i]);
        }
        emit eventConstruct("DPLANET", projectID);
    }
    
    receive() external payable{
    }
    
    
    function isPartners(address addr) public view returns(bool) {
        for(uint i = 0; i < addrs.length; i++){
            if(address(addrs[i]) == addr){
                return true;
            }
        }
        return false;
    }
    
    
    modifier onlyMember{
        require(isPartners(msg.sender) == true, "you must be a team member");
        _;
    }

    
    function Allocate() payable public onlyMember{
        uint256 amount = address(this).balance;
        require(amount > 0, "No trx to transfer");
        _master.transfer(5e6);
        uint256 _balance = address(this).balance;
        moneyAllocated += _balance;

        for(uint i = 0; i < addrs.length; ++i){
            addrs[i].transfer(_balance * percents[i] / 100);
            emit eventAllocate("DPLANET", projectID, address(this), addrs[i], _balance * percents[i] / 100);
        }
    }
    
    function getProjectID() public view returns (string memory){
        return projectID;
    }
    
    function getMoneyAlloacted() public view returns(uint256){
        return moneyAllocated;
    }
}

