// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;

import { IERC165 } from "@openzeppelin/contracts/introspection/IERC165.sol";

interface IWitnetPriceRouter {
  /// Emitted everytime a currency pair is attached to a new price feed contract
  /// @dev See https://github.com/adoracles/ADOIPs/blob/main/adoip-0010.md
  /// @dev to learn how these ids are created.
  event CurrencyPairSet(bytes32 indexed erc2362ID, IERC165 pricefeed);

  /// Helper pure function: returns hash of the provided ERC2362-compliant currency pair caption (aka ID).
  function currencyPairId(string memory) external pure virtual returns (bytes32);

  /// Returns the ERC-165-compliant price feed contract currently serving
  /// updates on the given currency pair.
  function getPriceFeed(bytes32 _erc2362id) external view virtual returns (IERC165);

  /// Returns human-readable ERC2362-based caption of the currency pair being
  /// served by the given price feed contract address.
  /// @dev Should fail if the given price feed contract address is not currently
  /// @dev registered in the router.
  function getPriceFeedCaption(IERC165) external view virtual returns (string memory);

  /// Returns human-readable caption of the ERC2362-based currency pair identifier, if known.
  function lookupERC2362ID(bytes32 _erc2362id) external view virtual returns (string memory);

  /// Register a price feed contract that will serve updates for the given currency pair.
  /// @dev Setting zero address to a currency pair implies that it will not be served any longer.
  /// @dev Otherwise, should fail if the price feed contract does not support the `IWitnetPriceFeed` interface,
  /// @dev or if given price feed is already serving another currency pair (within this WitnetPriceRouter instance).
  function setPriceFeed(
    IERC165 _pricefeed,
    uint256 _decimals,
    string calldata _base,
    string calldata _quote
  ) external virtual;

  /// Returns list of known currency pairs IDs.
  function supportedCurrencyPairs() external view virtual returns (bytes32[] memory);

  /// Returns `true` if given pair is currently being served by a compliant price feed contract.
  function supportsCurrencyPair(bytes32 _erc2362id) external view virtual returns (bool);

  /// Returns `true` if given price feed contract is currently serving updates to any known currency pair.
  function supportsPriceFeed(IERC165 _priceFeed) external view virtual returns (bool);

  /// Returns last valid price value and timestamp, as well as status of
  /// the latest update request that got posted to the Witnet Request Board.
  /// @dev Fails if the given currency pair is not currently supported.
  /// @param _erc2362id Price pair identifier as specified in https://github.com/adoracles/ADOIPs/blob/main/adoip-0010.md
  /// @return _lastPrice Last valid price reported back from the Witnet oracle.
  /// @return _lastTimestamp EVM-timestamp of the last valid price.
  /// @return _latestUpdateStatus Status code of latest update request that got posted to the Witnet Request Board:
  ///          - 200: latest update request was succesfully solved with no errors
  ///          - 400: latest update request was solved with errors
  ///          - 404: latest update request is still pending to be solved
  function valueFor(bytes32 _erc2362id)
    external
    view
    returns (
      int256 _lastPrice,
      uint256 _lastTimestamp,
      uint256 _latestUpdateStatus
    );
}
