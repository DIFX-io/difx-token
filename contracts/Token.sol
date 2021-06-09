// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
// pragma abicoder v2;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract DIFXToken is ERC20("DIFXToken", "Difx") {
    using SafeMath for uint256;

    address public immutable governance;

    uint256 public immutable startTime;

    mapping(address => uint256) public oneYearVesting;
    mapping(address => uint256) public twoYearVesting;

    // total supply allowed for one and two year vesting
    uint256 allowedOneYearVesting;
    uint256 claimedOneYearVesting;

    uint256 allowedTwoYearVesting;
    uint256 claimedTwoYearVesting;

    // strategic development supply details
    address development;
    uint256 public developmentLastClaimed;
    uint256 public developmentAllowedSupply;
    uint256 public developmentClaimedSupply;

    // founders and affilates supply details
    address founders;
    uint256 public founderLastClaimed;
    uint256 public founderAllowedSupply;
    uint256 public founderClaimedSupply;

    // core team supply details
    address coreTeam;
    uint256 public coreTeamLastClaimed;
    uint256 public coreTeamAllowedSupply;
    uint256 public coreTeamClaimedSupply;

    uint256 immutable QUARTER = 7776000;

    struct VestingData {
        address user;
        uint256 amount;
    }

    /**
     * @dev input all the addresses
     */
    constructor(
        address _governance,
        address _publicSale,
        address _launchpad,
        address _staking,
        address _founders,
        address _coreTeam,
        address _airdrops,
        address _advisory,
        address _bounty,
        address _development
    ) {
        governance = _governance;

        // mint for private sale with 1 years vesting
        _mint(address(this), 74250000 * 1e18);

        allowedOneYearVesting = 37125000 * 1e18;
        allowedTwoYearVesting = 37125000 * 1e18;

        // mint for Public Sale
        _mint(_publicSale, 99000000 * 1e18);

        // mint for Launchpad
        _mint(_launchpad, 74250000 * 1e18);

        // mint for Staking
        _mint(_staking, 55000000 * 1e18);

        // mint for Strategic Development
        _mint(address(this), 110000000 * 1e18);
        developmentAllowedSupply = 110000000 * 1e18;

        // mint for Founders
        _mint(address(this), 66000000 * 1e18);
        founderAllowedSupply = 66000000 * 1e18;

        // mint for Core Team
        _mint(address(this), 27500000 * 1e18);
        coreTeamAllowedSupply = 27500000 * 1e18;

        // mint for Airdrops, Referrals & New Account Registration
        _mint(_airdrops, 27500000 * 1e18);

        // mint for advisory panal
        _mint(_advisory, 11000000 * 1e18);

        // mint for bounty
        _mint(_bounty, 5500000 * 1e18);

        startTime = block.timestamp;

        development = _development;

        founders = _founders;

        coreTeam = _coreTeam;
    }

    // claim tokens
    function claim() public {
        require(
            oneYearVesting[msg.sender] > 0 || twoYearVesting[msg.sender] > 0,
            "not allowed"
        );
        if (oneYearVesting[msg.sender] > 0) {
            uint256 amount = oneYearVesting[msg.sender];
            // check if one year has been passed
            require(!(startTime + 31536000 >= block.timestamp), "prohibited");
            require(
                claimedOneYearVesting.add(amount) <= allowedOneYearVesting,
                "limit exceeded"
            );
            oneYearVesting[msg.sender] = 0;
            claimedOneYearVesting = claimedOneYearVesting.add(amount);
            transfer(msg.sender, amount);
        }
        if (twoYearVesting[msg.sender] > 0) {
            uint256 amount = twoYearVesting[msg.sender];
            // check if two years has been passed
            require(!(startTime + 31536000 >= block.timestamp), "prohibited");
            require(
                claimedTwoYearVesting.add(amount) <= claimedOneYearVesting,
                "limit exceeded"
            );
            twoYearVesting[msg.sender] = 0;
            claimedTwoYearVesting = claimedTwoYearVesting.add(amount);
            transfer(msg.sender, amount);
        }
    }

    function addToVesting(VestingData[] memory _users, uint256 _years) public {
        require(msg.sender == governance, "not authorised");
        if (_years == 1) {
            for (uint256 i = 0; i < _users.length; i++) {
                oneYearVesting[_users[i].user] = oneYearVesting[_users[i].user]
                    .add(_users[i].amount);
            }
        } else if (_years == 2) {
            for (uint256 i = 0; i < _users.length; i++) {
                twoYearVesting[_users[i].user] = twoYearVesting[_users[i].user]
                    .add(_users[i].amount);
            }
        }
    }

    function claimDevelopmentReward(address _to) public {
        require(msg.sender == development, "unauthorised");

        uint256 tokensToRelease = 13750000 * 1e18;

        if (developmentLastClaimed == 0) {
            developmentLastClaimed = block.timestamp;
            developmentClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        } else {
            require(
                developmentClaimedSupply + tokensToRelease <=
                    developmentAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= developmentLastClaimed + QUARTER,
                "token: let the quarter over"
            );
            developmentLastClaimed = developmentLastClaimed + QUARTER;
            developmentClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        }
    }

    function claimFounderReward(address _to) public {
        require(msg.sender == founders, "unauthorised");

        // tokens to release per quarter
        uint256 tokensToRelease = 8250000 * 1e18;

        if (founderLastClaimed == 0) {
            founderLastClaimed = block.timestamp;
            founderClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        } else {
            require(
                founderClaimedSupply + tokensToRelease <= founderAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= founderLastClaimed + QUARTER,
                "token: let the quarter over"
            );
            founderLastClaimed = founderLastClaimed + QUARTER;
            founderClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        }
    }

    function claimCoreTeamReward(address _to) public {
        require(msg.sender == coreTeam, "unauthorised");

        uint256 tokensToRelease = 3437500 * 1e18;

        if (coreTeamLastClaimed == 0) {
            coreTeamLastClaimed = block.timestamp;
            coreTeamClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        } else {
            require(
                coreTeamClaimedSupply + tokensToRelease <=
                    coreTeamAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= coreTeamLastClaimed + QUARTER,
                "token: let the quarter over"
            );
            coreTeamLastClaimed = coreTeamLastClaimed + QUARTER;
            coreTeamClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        }
    }
}
