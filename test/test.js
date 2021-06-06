const { expect } = require("chai");

let _governance;
let _publicSale;
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

beforeEach(async function () {
  [
    _governance,
    _publicSale,
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

  token = await Token.deploy(
    _governance.address,
    _publicSale.address,
    _launchpad.address,
    _staking.address,
    _strategicDevelopment.address,
    _founders.address,
    _coreTeam.address,
    _airdrops.address,
    _advisory.address,
    _bounty.address,
    _development.address
  );
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

  it("Should pre-mint 110000000 tokens for strategic development", async function () {
    expect(await token.balanceOf(_strategicDevelopment.address)).to.equal(toGwei(110000000));
  });

  it("Should pre-mint 66000000 tokens for founders and affilates", async function () {
    expect(await token.balanceOf(_founders.address)).to.equal(toGwei(66000000));
  });

  it("Should pre-mint 27500000 tokens for core team", async function () {
    expect(await token.balanceOf(_coreTeam.address)).to.equal(toGwei(27500000));
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

  it("Should pre-mint 74250000 tokens to the contract", async function () {
    expect(await token.balanceOf(token.address)).to.equal(toGwei(74250000));
  });

  // test main functions
  it("Should claim development reward correctly", async function () {

  });

  it("Should claim founders reward correctly", async function () {});

  it("Should claim core team reward correctly", async function () {});

  // test vesting
  it("Should test 1 year vesting period", async function () {
    // add 2 users to vesting
    await token
      .connect(_governance)
      .addToVesting([test1.address, test2.address], "1");

    // transfer some tokens to user A
    await token.connect(_launchpad).transfer(test1.address, toGwei(1000));

    expect(await token.connect(test1).transfer(test2.address, toGwei(1000))).to
      .be.reverted;
  });

  it("Should test 2 year vesting period", async function () {
    // expect(await token.balanceOf(_bounty.address)).to.equal(toGwei(5500000));
    // add 2 users to vesting
    await token
      .connect(_governance)
      .addToVesting([test1.address, test2.address], "2");

    // transfer some tokens to user A
    await token.connect(_launchpad).transfer(test1.address, toGwei(1000));

    expect(await token.connect(test1).transfer(test2.address, toGwei(1000))).to
      .be.reverted;
  });
});

function toGwei(_number) {
  return (_number * 1e18).toLocaleString("fullwide", { useGrouping: false }); // returns "4000000000000000000000000000"
}
