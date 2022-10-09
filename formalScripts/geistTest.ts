/* eslint-disable node/no-missing-import */
import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  AaveOracle,
  AaveProtocolDataProvider,
  ChefIncentivesController,
  GoledoToken,
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolAddressesProviderRegistry,
  LendingPoolCollateralManager,
  LendingPoolConfigurator,
  LendingRateOracle,
  MasterChef,
  MultiFeeDistribution,
  WETHGateway,
} from "../typechain";
import * as fs from 'fs';
import assert from 'assert-ts';
const SwappiRouterJSON = require(`./SwappiRouter.sol/SwappiRouter.json`);
const SwappiFactoryJSON = require(`./SwappiFactory.sol/SwappiFactory.json`);
const ADDRESSES: {
  [network: string]: {
    Admin: string;
    EmergencyAdmin: string;
    Treasury: string;
    WitnetRouter: string;
    WCFX: string;
    SwappiRouter: string;
    SwappiFactory: string;
    GenericLogic: string;
    ValidationLogic: string;
    ReserveLogic: string;
    WalletBalanceProvider: string;
    WETHGateway: string;
    GoledoToken: string;
    LendingPoolAddressesProviderRegistry: string;
    LendingPoolAddressesProvider: string;
    LendingPoolCollateralManager: string;
    LendingPoolConfiguratorImpl: string;
    LendingPoolConfigurator: string;
    LendingPoolImpl: string;
    LendingPool: string;
    AaveOracle: string;
    LendingRateOracle: string;
    AaveProtocolDataProvider: string;
    MultiFeeDistribution: string;
    ChefIncentivesController: string;
    MasterChef: string;
    UiPoolDataProvider: string;
    IncentiveDataProvider: string;
    ATokenImpl: string;
    StableDebtTokenImpl: string;
    VariableDebtTokenImpl: string;
    DefaultReserveInterestRateStrategy: string;
    SwappiLP: string;
    Markets: {
      [name: string]: {
        token: string;
        decimals: number;
        atoken: string;
        vtoken: string;
        stoken: string;
        oracle: string;
        witnetConfig: {
          assetId: string;
          decimals: number;
          timeout: number;
        };
      };
    };
  };
} = {
  testnet: {
    Admin: "0xad085e56f5673fd994453bbcdfe6828aa659cb0d",
    EmergencyAdmin: "0xad085e56f5673fd994453bbcdfe6828aa659cb0d",
    Treasury: "0xad085e56f5673fd994453bbcdfe6828aa659cb0d",
    WitnetRouter: "0x49c0bcce51a8b28f92d008394f06d5b259657f33",
    WCFX: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
    SwappiRouter: "0x873789aaf553fd0b4252d0d2b72c6331c47aff2e",
    SwappiFactory: "0x36b83e0d41d1dd9c73a006f0c1cbc1f096e69e34",
    GenericLogic: "",
    ValidationLogic: "",
    ReserveLogic: "",
    WalletBalanceProvider: "",
    WETHGateway: "",
    GoledoToken: "",
    LendingPoolAddressesProviderRegistry: "",
    LendingPoolAddressesProvider: "",
    LendingPoolCollateralManager: "",
    LendingPoolImpl: "",
    LendingPool: "",
    LendingPoolConfiguratorImpl: "",
    LendingPoolConfigurator: "",
    AaveOracle: "",
    LendingRateOracle: "",
    AaveProtocolDataProvider: "",
    MultiFeeDistribution: "",
    ChefIncentivesController: "",
    MasterChef: "",
    UiPoolDataProvider: "",
    IncentiveDataProvider: "",
    ATokenImpl: "",
    StableDebtTokenImpl: "",
    VariableDebtTokenImpl: "",
    DefaultReserveInterestRateStrategy: "",
    SwappiLP: "",
    Markets: {
      CFX: {
        token: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
        decimals: 18,
        atoken: "",
        stoken: "",
        vtoken: "",
        oracle: "",
        witnetConfig: {
          assetId: "0x65784185a07d3add5e7a99a6ddd4477e3c8caad717bac3ba3c3361d99a978c29",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      WETH: {
        token: "0xcd71270f82f319e0498ff98af8269c3f0d547c65",
        decimals: 18,
        atoken: "",
        stoken: "",
        vtoken: "",
        oracle: "",
        witnetConfig: {
          assetId: "0x3d15f7018db5cc80838b684361aaa100bfadf8a11e02d5c1c92e9c6af47626c8",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      WBTC: {
        token: "0x54593e02c39aeff52b166bd036797d2b1478de8d",
        decimals: 18,
        atoken: "",
        stoken: "",
        vtoken: "",
        oracle: "",
        witnetConfig: {
          assetId: "0x24beead43216e490aa240ef0d32e18c57beea168f06eabb94f5193868d500946",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      USDT: {
        token: "0x7d682e65efc5c13bf4e394b8f376c48e6bae0355",
        decimals: 18,
        atoken: "",
        stoken: "",
        vtoken: "",
        oracle: "",
        witnetConfig: {
          assetId: "0x538f5a25b39995a23c24037d2d38f979c8fa7b00d001e897212d936e6f6556ef",
          decimals: 6,
          timeout: 60 * 60 * 48,
        },
      },
    },
  },
  espace: {
    Admin: "0x507f8a2a5572179ea52aa749471611bcffccf9de",
    EmergencyAdmin: "0x440db4b6e54f7626fBeA81145495b2224Fd38131",
    Treasury: "0x507f8a2a5572179ea52aa749471611bcffccf9de",
    WitnetRouter: "0xd39d4d972c7e166856c4eb29e54d3548b4597f53",
    WCFX: "",
    SwappiRouter: "",
    SwappiFactory: "",
    GenericLogic: "",
    ValidationLogic: "",
    ReserveLogic: "",
    WalletBalanceProvider: "",
    WETHGateway: "",
    GoledoToken: "",
    LendingPoolAddressesProviderRegistry: "",
    LendingPoolAddressesProvider: "",
    LendingPoolCollateralManager: "",
    LendingPoolConfiguratorImpl: "",
    LendingPoolConfigurator: "",
    LendingPoolImpl: "",
    LendingPool: "",
    AaveOracle: "",
    LendingRateOracle: "",
    AaveProtocolDataProvider: "",
    MultiFeeDistribution: "",
    ChefIncentivesController: "",
    MasterChef: "",
    UiPoolDataProvider: "",
    IncentiveDataProvider: "",
    ATokenImpl: "",
    StableDebtTokenImpl: "",
    VariableDebtTokenImpl: "",
    DefaultReserveInterestRateStrategy: "",
    SwappiLP: "",
    Markets: {},
  },
};

const MAX_SUPPLY = ethers.utils.parseEther("100000000");
const GOLEDOVESTINGLOCKTIMESTAMP = 1664365001;
let goledoToken: GoledoToken;
let lendingPoolAddressesProviderRegistry: LendingPoolAddressesProviderRegistry;
let lendingPoolAddressesProvider: LendingPoolAddressesProvider;
let lendingPoolCollateralManager: LendingPoolCollateralManager;
let lendingPoolConfigurator: LendingPoolConfigurator;
let lendingPool: LendingPool;
let aaveOracle: AaveOracle;
let lendingRateOracle: LendingRateOracle;
let aaveProtocolDataProvider: AaveProtocolDataProvider;
let multiFeeDistribution: MultiFeeDistribution;
let chefIncentivesController: ChefIncentivesController;
let masterChef: MasterChef;
let wethGateway: WETHGateway;

async function main() {
  const [deployer] = await ethers.getSigners();
  

  let LendingPool = await ethers.getContractAt("LendingPool", "0x9FAD24f572045c7869117160A571B2e50b10d068", deployer);
  console.log("WETH getReserveData",await LendingPool.getReserveData("0x74b23882a30290451A17c44f4F05243b6b58C76d"));
  
  console.log("WBTC getReserveData",await LendingPool.getReserveData("0x321162Cd933E2Be498Cd2267a90534A804051b11"));
  console.log("WETH getConfiguration",await LendingPool.getConfiguration("0x74b23882a30290451A17c44f4F05243b6b58C76d")); // RF: divided by 2**64 = %50
  console.log("WBTC getConfiguration",await LendingPool.getConfiguration("0x321162Cd933E2Be498Cd2267a90534A804051b11")); //50%
  console.log("fusdt getConfiguration",await LendingPool.getConfiguration("0x049d68029688eAbF473097a2fC38ef61633A3C7A")); //50%
  console.log("wftm getConfiguration",await LendingPool.getConfiguration("0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"));
  // let UiPoolDataProvider = await ethers.getContractAt("UiPoolDataProvider", "0x03c5f70748E0a0122C07A2F194E04B7d0Fb7E008", deployer);
  // console.log("getSimpleReservesData ",await UiPoolDataProvider.getSimpleReservesData('0x6c793c628Fe2b480c5e6FB7957dDa4b9291F9c9b'));
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
