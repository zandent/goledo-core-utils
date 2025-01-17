// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;

interface IWETHGateway {
  function depositCFX(
    address lendingPool,
    address onBehalfOf,
    uint16 referralCode
  ) external payable;

  function withdrawCFX(
    address lendingPool,
    uint256 amount,
    address onBehalfOf
  ) external;

  function repayCFX(
    address lendingPool,
    uint256 amount,
    uint256 rateMode,
    address onBehalfOf
  ) external payable;

  function borrowCFX(
    address lendingPool,
    uint256 amount,
    uint256 interesRateMode,
    uint16 referralCode
  ) external;
}
