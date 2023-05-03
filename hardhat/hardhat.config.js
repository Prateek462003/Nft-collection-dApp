require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:".env"});
/** @type import('hardhat/config').HardhatUserConfig */
const QUICKNODE_HTTP_URI = process.env.QUICKNODE_HTTP_URI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.18",
  networks:{
    hardhat:{
    },
    sepolia:{
      url:QUICKNODE_HTTP_URI,
      accounts:[`0x${PRIVATE_KEY}`],
    }
  }
};
