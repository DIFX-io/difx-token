const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // get the contract from arrtifxats

  const Token = await ethers.getContractFactory("DIFXToken");

  const network = "kovan";

  // Replace this addresses
  const _governance = "";
  const _publicSale = "";
  const _launchpad = "";
  const _staking = "";
  const _strategicDevelopment = "";
  const _founders = "";
  const _coreTeam = "";
  const _airdrops = "";
  const _advisory = "";
  const _bounty = "";

  const difxToken = await Token.deploy(
    _governance,
    _publicSale,
    _launchpad,
    _staking,
    _strategicDevelopment,
    _founders,
    _coreTeam,
    _airdrops,
    _advisory,
    _bounty
  );

  console.log("🎉 Contracts Deployed");
  console.log({
    DIFXToken: difxToken.address,
  });

  console.log("✅  Etherscan Verification Command: ");
  console.log(
    `npx hardhat verify --network ${network} ${difxToken.address} "${_governance}" "${_publicSale}" "${_launchpad}" "${_staking}" "${_strategicDevelopment}" "${_founders}" "${_coreTeam}" "${_airdrops}" "${_advisory}" "${_bounty}"`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
