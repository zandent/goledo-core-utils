// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { IERC20Detailed } from "../interfaces/IERC20Detailed.sol";
import { MultiFeeDistribution } from "../staking/MultiFeeDistribution.sol";

interface IChefIncentivesController {
  // Info of each user.
  struct UserInfo {
    uint256 amount;
    uint256 rewardDebt;
  }

  // Info of each pool.
  struct PoolInfo {
    uint256 totalSupply;
    uint256 allocPoint; // How many allocation points assigned to this pool.
    uint256 lastRewardTime; // Last second that reward distribution occurs.
    uint256 accRewardPerShare; // Accumulated rewards per share, times 1e12. See below.
    address onwardIncentives;
  }

  function poolLength() external view returns (uint256);

  function rewardsPerSecond() external view returns (uint256);

  function totalAllocPoint() external view returns (uint256);

  function registeredTokens(uint256 _index) external view returns (address);

  function poolInfo(address _token) external view returns (PoolInfo memory);

  function userInfo(address _token, address _user) external view returns (UserInfo memory);
}

interface IMasterChef {
  // Info of each user.
  struct UserInfo {
    uint256 amount;
    uint256 rewardDebt;
  }

  // Info of each pool.
  struct PoolInfo {
    uint256 allocPoint; // How many allocation points assigned to this pool.
    uint256 lastRewardTime; // Last second that reward distribution occurs.
    uint256 accRewardPerShare; // Accumulated rewards per share, times 1e12. See below.
    address onwardIncentives;
  }

  function poolLength() external view returns (uint256);

  function rewardsPerSecond() external view returns (uint256);

  function totalAllocPoint() external view returns (uint256);

  function registeredTokens(uint256 _index) external view returns (address);

  function poolInfo(address _token) external view returns (PoolInfo memory);

  function userInfo(address _token, address _user) external view returns (UserInfo memory);
}

interface IMultiFeeDistribution {
  struct LockedBalance {
    uint256 amount;
    uint256 unlockTime;
  }
  struct RewardData {
    address token;
    uint256 amount;
  }

  function totalSupply() external view returns (uint256);

  function lockedSupply() external view returns (uint256);

  function stakingToken() external view returns (address);

  function claimableRewards(address account) external view returns (RewardData[] memory rewards);

  function totalBalance(address user) external view returns (uint256 amount);

  function unlockedBalance(address user) external view returns (uint256 amount);

  function earnedBalances(address user) external view returns (uint256 total, LockedBalance[] memory earningsData);

  function lockedBalances(address user)
    external
    view
    returns (
      uint256 total,
      uint256 unlockable,
      uint256 locked,
      LockedBalance[] memory lockData
    );

  function withdrawableBalance(address user) external view returns (uint256 amount, uint256 penaltyAmount);
}

contract IncentiveDataProvider {
  using SafeMath for uint256;

  IChefIncentivesController public incentiveController;
  IMasterChef public masterChef;
  IMultiFeeDistribution public multiFeeDistribution;

  struct UserIncentiveData {
    address token;
    string symbol;
    uint8 decimals;
    uint256 walletBalance;
    uint256 totalSupply;
    uint256 staked;
    uint256 claimable;
    uint256 allocPoint;
  }

  struct IncentivesData {
    uint256 totalAllocPoint;
    uint256 rewardsPerSecond;
  }

  struct UserStakeData {
    uint256 walletBalance;
    uint256 totalBalance;
    uint256 unlockedBalance;
    IMultiFeeDistribution.LockedBalance[] earnedBalances;
    IMultiFeeDistribution.LockedBalance[] lockedBalances;
    IMultiFeeDistribution.RewardData[] rewards;
  }

  struct StakeData {
    address token;
    string symbol;
    uint8 decimals;
    uint256 totalSupply;
    uint256 lockedSupply;
  }

  constructor(
    address _incentiveController,
    address _masterChef,
    address _multiFeeDistribution
  ) {
    incentiveController = IChefIncentivesController(_incentiveController);
    masterChef = IMasterChef(_masterChef);
    multiFeeDistribution = IMultiFeeDistribution(_multiFeeDistribution);
  }

  function getUserIncentive(address _account)
    external
    view
    returns (
      UserIncentiveData[] memory _controllerUserData,
      IncentivesData memory _controllerData,
      UserIncentiveData[] memory _chefUserData,
      IncentivesData memory _chefData,
      UserStakeData memory _stakeUserData,
      StakeData memory _stakeData
    )
  {
    (_controllerUserData, _controllerData) = _getIncentiveControllerData(_account);
    (_chefUserData, _chefData) = _getMasterChefData(_account);

    address _token = multiFeeDistribution.stakingToken();
    _stakeUserData.walletBalance = IERC20(_token).balanceOf(_account);
    _stakeUserData.totalBalance = multiFeeDistribution.totalBalance(_account);
    _stakeUserData.unlockedBalance = multiFeeDistribution.unlockedBalance(_account);
    (, _stakeUserData.earnedBalances) = multiFeeDistribution.earnedBalances(_account);
    (, , , _stakeUserData.lockedBalances) = multiFeeDistribution.lockedBalances(_account);
    _stakeUserData.rewards = multiFeeDistribution.claimableRewards(_account);
    _stakeData.token = _token;
    _stakeData.decimals = IERC20Detailed(_token).decimals();
    _stakeData.symbol = IERC20Detailed(_token).symbol();
    _stakeData.totalSupply = multiFeeDistribution.totalSupply();
    _stakeData.lockedSupply = multiFeeDistribution.lockedSupply();
  }

  function _getIncentiveControllerData(address _account)
    internal
    view
    returns (UserIncentiveData[] memory _controllerUserData, IncentivesData memory _controllerData)
  {
    uint256 _length = incentiveController.poolLength();
    _controllerData.rewardsPerSecond = incentiveController.rewardsPerSecond();
    _controllerData.totalAllocPoint = incentiveController.totalAllocPoint();
    _controllerUserData = new UserIncentiveData[](_length);
    for (uint256 i = 0; i < _length; i++) {
      IChefIncentivesController.PoolInfo memory pool;
      IChefIncentivesController.UserInfo memory user;
      {
        address _token = incentiveController.registeredTokens(i);
        pool = incentiveController.poolInfo(_token);
        user = incentiveController.userInfo(_token, _account);
        _controllerUserData[i].token = _token;
        _controllerUserData[i].decimals = IERC20Detailed(_token).decimals();
        _controllerUserData[i].symbol = IERC20Detailed(_token).symbol();
        _controllerUserData[i].walletBalance = IERC20(_token).balanceOf(_account);
      }
      _controllerUserData[i].staked = user.amount;
      _controllerUserData[i].totalSupply = pool.totalSupply;
      _controllerUserData[i].allocPoint = pool.allocPoint;

      uint256 accRewardPerShare = pool.accRewardPerShare;
      if (block.timestamp > pool.lastRewardTime && pool.totalSupply != 0) {
        uint256 reward = ((block.timestamp - pool.lastRewardTime) *
          _controllerData.rewardsPerSecond *
          pool.allocPoint) / _controllerData.totalAllocPoint;
        accRewardPerShare += (reward * 1e12) / pool.totalSupply;
      }
      _controllerUserData[i].claimable = user.amount.mul(accRewardPerShare).div(1e12).sub(user.rewardDebt);
    }
  }

  function _getMasterChefData(address _account)
    internal
    view
    returns (UserIncentiveData[] memory _chefUserData, IncentivesData memory _chefData)
  {
    uint256 _length = masterChef.poolLength();
    _chefData.rewardsPerSecond = masterChef.rewardsPerSecond();
    _chefData.totalAllocPoint = masterChef.totalAllocPoint();
    _chefUserData = new UserIncentiveData[](_length);
    for (uint256 i = 0; i < _length; i++) {
      IMasterChef.PoolInfo memory pool;
      IMasterChef.UserInfo memory user;
      {
        address _token = masterChef.registeredTokens(i);
        pool = masterChef.poolInfo(_token);
        user = masterChef.userInfo(_token, _account);
        _chefUserData[i].token = _token;
        _chefUserData[i].decimals = IERC20Detailed(_token).decimals();
        _chefUserData[i].symbol = IERC20Detailed(_token).symbol();
        _chefUserData[i].totalSupply = IERC20(_token).balanceOf(address(masterChef));
        _chefUserData[i].walletBalance = IERC20(_token).balanceOf(_account);
      }
      _chefUserData[i].staked = user.amount;
      _chefUserData[i].allocPoint = pool.allocPoint;

      uint256 accRewardPerShare = pool.accRewardPerShare;
      if (block.timestamp > pool.lastRewardTime && _chefUserData[i].totalSupply != 0) {
        uint256 duration = block.timestamp.sub(pool.lastRewardTime);
        uint256 reward = (duration * _chefData.rewardsPerSecond * pool.allocPoint) / _chefData.totalAllocPoint;
        accRewardPerShare += (reward * 1e12) / _chefUserData[i].totalSupply;
      }
      _chefUserData[i].claimable = user.amount.mul(accRewardPerShare).div(1e12).sub(user.rewardDebt);
    }
  }
}
