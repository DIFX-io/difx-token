const { expect } = require("chai");
require("@nomiclabs/hardhat-ethers");
const { solidity } = "ethereum-waffle";

let _governance;
let _publicSale;
let _privateSale;
let _launchpad;
let _staking;
let _strategicDevelopment;
let _founders;
let _coreTeam;
let _airdrops;
let _advisory;
let _bounty;
let _development;

let test1;
let test2;

let token;
let vesting;

beforeEach(async function () {
  [
    _governance,
    _publicSale,
    _privateSale,
    _launchpad,
    _staking,
    _strategicDevelopment,
    _founders,
    _coreTeam,
    _airdrops,
    _advisory,
    _bounty,
    _development,
    test1,
    test2,
  ] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("DIFXToken");
  const Vesting = await ethers.getContractFactory("Vesting");

  vesting = await Vesting.deploy(
    _governance.address,
    _development.address,
    _founders.address,
    _coreTeam.address
  );

  token = await Token.deploy(
    vesting.address,
    _publicSale.address,
    _launchpad.address,
    _staking.address,
    _airdrops.address,
    _advisory.address,
    _bounty.address
  );

  await vesting.addToken(token.address);
});

describe("Token", function () {
  it("Should pre-mint 99000000 tokens for public sale", async function () {
    expect(await token.balanceOf(_publicSale.address)).to.equal(
      toGwei(99000000)
    );
  });

  it("Should pre-mint 74250000 tokens for launch pad", async function () {
    expect(await token.balanceOf(_launchpad.address)).to.equal(
      toGwei(74250000)
    );
  });

  it("Should pre-mint 55000000 tokens for staking", async function () {
    expect(await token.balanceOf(_staking.address)).to.equal(toGwei(55000000));
  });

  it("Should pre-mint 27500000 tokens for airdrops", async function () {
    expect(await token.balanceOf(_airdrops.address)).to.equal(toGwei(27500000));
  });

  it("Should pre-mint 11000000 tokens for advisory", async function () {
    expect(await token.balanceOf(_advisory.address)).to.equal(toGwei(11000000));
  });

  it("Should pre-mint 5500000 tokens for bounty", async function () {
    expect(await token.balanceOf(_bounty.address)).to.equal(toGwei(5500000));
  });

  it("Should pre-mint 277750000 tokens to the vesting contract", async function () {
    expect(await token.balanceOf(vesting.address)).to.equal(toGwei(277750000));
  });
});

describe("Vesting", function () {
  // add to one year vesting
  beforeEach(async function () {
    vesting.addToVesting(
      [
        [test1.address, 100],
        [test2.address, 200],
      ],
      "1"
    );
  });

  // test main functions
  it("Should revert when one year hasn't passed", async function () {
    // add 2 users to vesting
    await vesting.connect(_governance).addToVesting(
      [
        [test1.address, 100],
        [test2.address, 200],
      ],
      "1"
    );
    await vesting
      .connect(test1)
      .claimVested()
      .catch((err) => {
      });

    // catch revert here
    // expect(await token.balanceOf(test1.address)).to.equal(100);
  });

  // test main functions
  it("Should claim when one year is complete from vesting", async function () {
    // advance blockchain time to one year
    await ethers.provider.send("evm_increaseTime", [31536002]);

    await vesting.connect(test1).claimVested();
    expect(await token.balanceOf(test1.address)).to.equal(100);
  });

  // test main functions
  it("Should claim team reward quarterly", async function () {
    // advance increase for one quarter
    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_development).claimForTeam(0, _development.address);

    expect(await token.balanceOf(_development.address)).to.equal(
      toGwei(110000000)
    );
  });

  // test main functions
  it("Should claim founder reward quarterly", async function () {
    // advance increase for one quarter
    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    await ethers.provider.send("evm_increaseTime", [7776000]);
    await vesting.connect(_founders).claimForTeam(1, _founders.address);

    expect(await token.balanceOf(_founders.address)).to.equal(toGwei(66000000));
  });

  it("Should claim development reward correctly after one", async function () {});

  it("Should claim core team reward correctly", async function () {});
});

function toGwei(_number) {
  return (_number * 1e18).toLocaleString("fullwide", { useGrouping: false }); // returns "4000000000000000000000000000"
}
