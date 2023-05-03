const {ethers} = require("hardhat");
require("dotenv").config();

const {WHITELIST_CONTRACT_ADDRESS, METADATA_URL} = require("../constants/index.js");

async function main(){
    const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
    const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");
    const deplolyedCryptoDevs = await cryptoDevsContract.deploy(
        METADATA_URL,
        whitelistContract
        );
    await deplolyedCryptoDevs.deployed();

    console.log("Contract Deployed At:", deplolyedCryptoDevs.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });