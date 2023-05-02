// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    // Creating Instance of whitelist intetrface
    IWhitelist whitelist;
    
    string public baseTokenURI;
    bool public _paused;
    bool public  preSaleStarted  = false;
    uint256 public preSaleEnded ;
    uint256 public maxTokenIds = 20;
    uint256 public tokenIds;
    uint256 public preSalePrice = 0.01 ether;
    uint256 public publicMintPrice = 0.02 ether;

    constructor(string memory baseURI, address whitelistContract) ERC721("CryptoDevs", "CD") {
        baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    modifier onlyWhenNotPaused{
        require(!_paused, "Contract currently Paused");
        _;
    }
    
    function startPresale() public onlyOwner{
        preSaleStarted = true;
        preSaleEnded = block.timestamp + 5 minutes ;
    }
    
    function preSaleMint() public payable onlyWhenNotPaused {
        require(preSaleStarted && block.timestamp < preSaleEnded, "PreSale has ended!");
        require(tokenIds < maxTokenIds, "Exceeded the max token Mint Limit");
        require(whitelist.whiteListedAddresses(msg.sender), "You are not whitelisted!");
        require(msg.value >= preSalePrice, "Insufficient amount of ether");
        tokenIds++;
        _safeMint(msg.sender, tokenIds);
    }


    function publicMint() public payable onlyWhenNotPaused{
        require(tokenIds < maxTokenIds , "Exceeded the maximum Token Mint Limit");
        require(msg.value >= publicMintPrice, "Insufficient Ethers sent");
        tokenIds++;
        _safeMint(msg.sender, tokenIds);
    }

    function  withdraw() onlyOwner public {
        address address_owner = owner();
        uint256 balance = address(this).balance;
        (bool sent, ) = address_owner.call{value:balance}("");
        require(sent, "Failed To send ether");
    }

    function setPaused(bool val) public onlyOwner{
        _paused = val;
    } 
    
    function _baseURI() internal view virtual override returns(string memory){
        return baseTokenURI; 
    }
    // To recieve ethers....
    receive() external payable {}
    fallback() external payable {}


}
