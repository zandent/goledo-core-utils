// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/IPriceFeed.sol";
import "../interfaces/IWitnetPriceFeed.sol";
import "../interfaces/IWitnetPriceRouter.sol";

/*
 * PriceFeed for mainnet deployment, to be connected to Custom's live ETH:USD aggregator reference
 * contract, and a wrapper contract bandOracle, which connects to BandMaster contract.
 *
 * The PriceFeed uses Custom as primary oracle, and Band as fallback. It contains logic for
 * switching oracles based on oracle failures, timeouts, and conditions for returning to the primary
 * Custom oracle.
 */
contract WitnetPriceFeed is IPriceFeed {
  using SafeMath for uint256;

  uint256 public constant DECIMAL_PRECISION = 1e18;

  IWitnetPriceRouter public witnetRouter; // Mainnet Witnet Price

  bytes32 public witnetAssetID; // The asset used to query on Witnet

  uint256 public witnetDecimals; // The decimals for witnet Price

  // Use to convert a price answer to an 18-digit precision uint
  uint256 public constant TARGET_DIGITS = 18;

  // Maximum time period allowed since Custom's latest round data timestamp, beyond which Custom is considered frozen.
  // For stablecoins we recommend 90000, as Custom updates once per day when there is no significant price movement
  // For volatile assets we recommend 14400 (4 hours)
  uint256 public immutable TIMEOUT;

  // Maximum deviation allowed between two consecutive Custom oracle prices. 18-digit precision.
  uint256 public constant MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND = 5e17; // 50%

  /*
   * The maximum relative price difference between two oracle responses allowed in order for the PriceFeed
   * to return to using the Custom oracle. 18-digit precision.
   */
  uint256 public constant MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES = 5e16; // 5%

  // The last good price seen from an oracle by Liquity
  uint256 public lastGoodPrice;

  struct WitnetResponse {
    int256 lastPrice;
    uint256 timestamp;
    // - 200: latest update request was succesfully solved with no errors
    // - 400: latest update request was solved with errors
    // - 404: latest update request is still pending to be solved
    uint256 status;
  }

  enum Status {
    WitnetWorking,
    WitnetBroken,
    WitnetFrozen
  }

  // The current status of the PricFeed, which determines the conditions for the next price fetch attempt
  Status public status;

  event LastGoodPriceUpdated(uint256 _lastGoodPrice);
  event PriceFeedStatusChanged(Status newStatus);

  // --- Dependency setters ---

  constructor(
    IWitnetPriceRouter _witnetRouter,
    bytes32 _witnetAssetID,
    uint256 _witnetDecimals,
    uint256 _timeout
  ) {
    witnetRouter = _witnetRouter;
    witnetAssetID = _witnetAssetID;
    witnetDecimals = _witnetDecimals;

    TIMEOUT = _timeout;

    // Explicitly set initial system status
    status = Status.WitnetWorking;

    // Get an initial price from Custom to serve as first reference for lastGoodPrice
    WitnetResponse memory witnetResponse = _getCurrentWitnetResponse();

    require(
      !_witnetIsBroken(witnetResponse) && block.timestamp.sub(witnetResponse.timestamp) < _timeout,
      "PriceFeed: witnet must be working and current"
    );

    lastGoodPrice = _scaleWitnetPriceByDigits(uint256(witnetResponse.lastPrice));
  }

  // --- Functions ---

  /*
   * fetchPrice():
   * Returns the latest price obtained from the Oracle. Called by Liquity functions that require a current price.
   *
   * Also callable by anyone externally.
   *
   * Non-view function - it stores the last good price seen by Liquity.
   *
   * Uses a main oracle (Custom) and a fallback oracle (Band) in case Custom fails. If both fail,
   * it uses the last good price seen by Liquity.
   *
   */
  function fetchPrice() external view override returns (uint256) {
    (, uint256 price) = _fetchPrice();
    return price;
  }

  function updatePrice() external override returns (uint256) {
    (Status newStatus, uint256 price) = _fetchPrice();
    lastGoodPrice = price;
    if (status != newStatus) {
      status = newStatus;
      emit PriceFeedStatusChanged(newStatus);
    }
    return price;
  }

  function forceUpdateWitnet() external payable {
    IWitnetPriceFeed _priceFeed = IWitnetPriceFeed(address(witnetRouter.getPriceFeed(witnetAssetID)));
    uint256 _updateFee = _priceFeed.estimateUpdateFee(tx.gasprice);
    _priceFeed.requestUpdate{ value: _updateFee }();
    if (msg.value > _updateFee) {
      payable(msg.sender).transfer(msg.value - _updateFee);
    }
  }

  function _fetchPrice() internal view returns (Status, uint256) {
    // Get current price data from Witnet
    WitnetResponse memory _response = _getCurrentWitnetResponse();

    // --- CASE 1: System fetched last price from Witnet  ---
    if (status == Status.WitnetWorking) {
      if (_witnetIsBroken(_response)) {
        return (Status.WitnetBroken, lastGoodPrice);
      }

      if (_witnetIsFrozen(_response)) {
        return (Status.WitnetFrozen, lastGoodPrice);
      }

      return (Status.WitnetWorking, _scaleWitnetPriceByDigits(uint256(_response.lastPrice)));
    }

    // --- CASE 2: Witnet is broken at the last price fetch ---
    if (status == Status.WitnetBroken) {
      if (!_witnetIsBroken(_response) && !_witnetIsFrozen(_response)) {
        return (Status.WitnetWorking, _scaleWitnetPriceByDigits(uint256(_response.lastPrice)));
      }
      if (_witnetIsFrozen(_response)) {
        return (Status.WitnetFrozen, lastGoodPrice);
      }
      return (Status.WitnetBroken, lastGoodPrice);
    }

    // --- CASE 3: Witnet is frozen at the last price fetch ---
    if (status == Status.WitnetFrozen) {
      if (!_witnetIsBroken(_response) && !_witnetIsFrozen(_response)) {
        return (Status.WitnetWorking, _scaleWitnetPriceByDigits(uint256(_response.lastPrice)));
      }
      if (_witnetIsFrozen(_response)) {
        return (Status.WitnetBroken, lastGoodPrice);
      }
      return (Status.WitnetFrozen, lastGoodPrice);
    }
  }

  // --- Helper functions ---

  function _witnetIsBroken(WitnetResponse memory _response) internal view returns (bool) {
    // Check for response call reverted
    if (_response.status == 400 || _response.status == 404) {
      return true;
    }
    // Check for an invalid timeStamp that is 0, or in the future
    if (_response.timestamp == 0 || _response.timestamp > block.timestamp) {
      return true;
    }
    // Check for zero price or negative
    if (_response.lastPrice <= 0) {
      return true;
    }

    return false;
  }

  function _witnetIsFrozen(WitnetResponse memory _response) internal view returns (bool) {
    return block.timestamp.sub(_response.timestamp) > TIMEOUT;
  }

  function _scaleWitnetPriceByDigits(uint256 _price) internal view returns (uint256) {
    /*
     * Convert the price returned by the Witnet oracle to an 18-digit decimal for use by Liquity.
     * At date of Liquity launch, Witnet uses an 8-digit price, but we also handle the possibility of
     * future changes.
     *
     */
    uint256 _answerDigits = witnetDecimals;
    uint256 price;
    if (_answerDigits > TARGET_DIGITS) {
      // Scale the returned price value down to Liquity's target precision
      price = _price.div(10**(_answerDigits - TARGET_DIGITS));
    } else if (_answerDigits < TARGET_DIGITS) {
      // Scale the returned price value up to Liquity's target precision
      price = _price.mul(10**(TARGET_DIGITS - _answerDigits));
    }
    return price;
  }

  // --- Oracle response wrapper functions ---

  function _getCurrentWitnetResponse() internal view returns (WitnetResponse memory witnetResponse) {
    try witnetRouter.valueFor(witnetAssetID) returns (
      int256 lastPrice,
      uint256 lastTimestamp,
      uint256 latestUpdateStatus
    ) {
      // If call to Witnet succeeds, return the response and success = true
      witnetResponse.lastPrice = lastPrice;
      witnetResponse.timestamp = lastTimestamp;
      witnetResponse.status = latestUpdateStatus;

      return (witnetResponse);
    } catch {
      witnetResponse.status = 404;
      // If call to Witnet reverts, return a zero response with status = 404
      return (witnetResponse);
    }
  }
}
