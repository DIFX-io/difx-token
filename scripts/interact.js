const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // get the contract from arrtifxats
  console.log(`
    Hello
    World`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
