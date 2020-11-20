pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // 1.stakes token (deposit)
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "Opp, You must stake some token.");

        // allow contract spend money
        //error: => daiToken.approve(address(this), _amount);

        // transfer mDai to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;
        if (!hasStaked[msg.sender]) {
            hasStaked[msg.sender] = true;
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
    }

    // 2.unnstakes token (widthdraw)
    function unStake() public {
        if (hasStaked[msg.sender]) {
            uint256 balance = stakingBalance[msg.sender];
            daiToken.transfer(msg.sender, balance);

            hasStaked[msg.sender] = false;
            isStaking[msg.sender] = false;
            stakingBalance[msg.sender] = 0;
        }
    }

    // 3.issuing token
    function issueToken() public {
        if (isStaking[msg.sender]) {
            uint256 balance = stakingBalance[msg.sender];
            dappToken.transfer(msg.sender, balance);

            isStaking[msg.sender] = false;
        }
    }
}
