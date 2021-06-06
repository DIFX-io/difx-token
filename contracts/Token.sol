// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.6;

import "./ERC20.sol";

contract DIFXToken is ERC20("DIFXToken", "Difx") {
    address public governance;

    uint256 public startTime;

    mapping(address => bool) public oneYearVesting;
    mapping(address => bool) public twoYearVesting;

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

    /**
     * @dev input all the addresses
     */
    constructor(
        address _governance,
        address _publicSale,
        address _launchpad,
        address _staking,
        address _strategicDevelopment,
        address _founders,
        address _coreTeam,
        address _airdrops,
        address _advisory,
        address _bounty,
        address _development
    ) {
        governance = _governance;

        // mint for private sale with 1 years vesting
        _mint(address(this), 37125000 * 1e18);

        // mint for private sale with 2 years vesting
        _mint(address(this), 37125000 * 1e18);

        // mint for Public Sale
        _mint(_publicSale, 99000000 * 1e18);

        // mint for Launchpad
        _mint(_launchpad, 74250000 * 1e18);

        // mint for Staking
        _mint(_staking, 55000000 * 1e18);

        // mint for Strategic Development
        _mint(_strategicDevelopment, 110000000 * 1e18);
        developmentAllowedSupply = 110000000 * 1e18;

        // mint for Founders
        _mint(_founders, 66000000 * 1e18);
        founderAllowedSupply = 66000000 * 1e18;

        // mint for Core Team
        _mint(_coreTeam, 27500000 * 1e18);
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

    function transfer(address recipient, uint256 amount) public returns (bool) {
        if (oneYearVesting[msg.sender]) {
            require(!(startTime + 31536000 >= block.timestamp), "prohibited");
            return internalTransfer(recipient, amount);
        } else if (twoYearVesting[msg.sender] == true) {
            require(!(startTime + 31536000 * 2 >= block.timestamp), "prohibited");
            return internalTransfer(recipient, amount);
        } else {
            return internalTransfer(recipient, amount);
        }
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        if (oneYearVesting[sender]) {
            require(!(startTime + 31536000 >= block.timestamp), "prohibited");
            return internalTransferFrom(sender, recipient, amount);
        } else if (twoYearVesting[sender]) {
            require(!(startTime + 31536000 * 2 >= block.timestamp), "prohibited");
            return internalTransferFrom(sender, recipient, amount);
        } else {
            return internalTransferFrom(sender, recipient, amount);
        }
    }

    function addToVesting(address[] memory _users, uint256 _years) public {
        require(msg.sender == governance, "not authorised");
        if (_years == 1) {
            for (uint256 i = 0; i < _users.length; i++) {
                oneYearVesting[_users[i]] = true;
            }
        } else if (_years == 2) {
            for (uint256 i = 0; i < _users.length; i++) {
                twoYearVesting[_users[i]] = true;
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
                developmentClaimedSupply <= developmentAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= developmentLastClaimed + 7776000,
                "token: let the quarter over"
            );
            developmentLastClaimed = developmentLastClaimed + 7776000;
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
                founderClaimedSupply <= founderAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= founderLastClaimed + 7776000,
                "token: let the quarter over"
            );
            founderLastClaimed = founderLastClaimed + 7776000;
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
                coreTeamClaimedSupply <= coreTeamAllowedSupply,
                "token: let the quarter over"
            );
            require(
                block.timestamp >= coreTeamLastClaimed + 7776000,
                "token: let the quarter over"
            );
            coreTeamLastClaimed = coreTeamLastClaimed + 7776000;
            coreTeamClaimedSupply += tokensToRelease;
            transfer(_to, tokensToRelease);
        }
    }
}
