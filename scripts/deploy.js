const { _toEscapedUtf8String } = require("@ethersproject/strings");
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // get the contract from arrtifxats

  const Token = await ethers.getContractFactory("DIFXToken");
  const Vesting = await ethers.getContractFactory("Vesting");

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

  const vesting = await Vesting.deploy(
    _governance,
    _strategicDevelopment,
    _founders,
    _coreTeam
  );

  const difxToken = await Token.deploy(
    vesting.address,
    _publicSale,
    _launchpad,
    _staking,
    _airdrops,
    _advisory,
    _bounty
  );

  await vesting.addToken(difxToken.address);

  console.log("🎉 Contracts Deployed");
  console.log({
    Vesting: vesting.address,
    DIFXToken: difxToken.address,
  });

  console.log("✅  Etherscan Verification Command: ");
  console.log("VESTING:");
  console.log(
    `npx hardhat verify --network ${network} ${vesting.address} "${_governance}" "${_strategicDevelopment}" "${_founders}" "${_coreTeam}"`
  );
  console.log(
    `npx hardhat verify --network ${network} ${difxToken.address} "${vesting.address}" "${_publicSale}" "${_launchpad}" "${_staking}" "${_airdrops}" "${_advisory}" "${_bounty}"`
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
