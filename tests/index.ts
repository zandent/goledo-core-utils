/* eslint-disable node/no-missing-import */
import { constants } from "ethers";
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
} from "../typechain";

const ADDRESSES: {
  [network: string]: {
    Admin: string;
    Treasury: string;
    WitnetRouter: string;
    WCFX: string;
    GenericLogic?: string;
    ValidationLogic?: string;
    ReserveLogic?: string;
    WalletBalanceProvider?: string;
    WETHGateway?: string;
    GoledoToken?: string;
    LendingPoolAddressesProviderRegistry?: string;
    LendingPoolAddressesProvider?: string;
    LendingPoolCollateralManager?: string;
    LendingPoolConfiguratorImpl?: string;
    LendingPoolConfigurator?: string;
    LendingPoolImpl?: string;
    LendingPool?: string;
    AaveOracle?: string;
    LendingRateOracle?: string;
    AaveProtocolDataProvider?: string;
    MultiFeeDistribution?: string;
    ChefIncentivesController?: string;
    MasterChef?: string;
    UiPoolDataProvider?: string;
    ATokenImpl?: string;
    StableDebtTokenImpl?: string;
    VariableDebtTokenImpl?: string;
    DefaultReserveInterestRateStrategy?: string;
    Markets: {
      [name: string]: {
        token: string;
        decimals: number;
        atoken?: string;
        vtoken?: string;
        stoken?: string;
        oracle?: string;
      };
    };
  };
} = {
  testnet: {
    Admin: "0x121f7b3F158A2331a964Fc9cBa092fb64B464A41",
    Treasury: "0x121f7b3F158A2331a964Fc9cBa092fb64B464A41",
    WitnetRouter: "0x49c0bcce51a8b28f92d008394f06d5b259657f33",
    WCFX: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
    GenericLogic: undefined,
    ValidationLogic: undefined,
    ReserveLogic: undefined,
    WalletBalanceProvider: undefined,
    WETHGateway: undefined,
    GoledoToken: undefined,
    LendingPoolAddressesProviderRegistry: undefined,
    LendingPoolAddressesProvider: undefined,
    LendingPoolCollateralManager: undefined,
    LendingPoolConfiguratorImpl: undefined,
    LendingPoolConfigurator: undefined,
    LendingPoolImpl: undefined,
    LendingPool: undefined,
    AaveOracle: undefined,
    LendingRateOracle: undefined,
    AaveProtocolDataProvider: undefined,
    MultiFeeDistribution: undefined,
    ChefIncentivesController: undefined,
    MasterChef: undefined,
    UiPoolDataProvider: undefined,
    ATokenImpl: undefined,
    StableDebtTokenImpl: undefined,
    VariableDebtTokenImpl: undefined,
    DefaultReserveInterestRateStrategy: undefined,
    Markets: {
      CFX: {
        token: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
        decimals: 18,
      },
    },
  },
};

const MAX_SUPPLY = ethers.utils.parseEther("100000000");

describe("test", async () => {
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

  beforeEach(async () => {
    const [deployer] = await ethers.getSigners();
    const addresses = ADDRESSES.testnet;
    addresses.Admin = deployer.address;

    if (addresses.GenericLogic) {
      const genericLogic = await ethers.getContractAt("GenericLogic", addresses.GenericLogic, deployer);
      console.log("Found GenericLogic at:", genericLogic.address);
    } else {
      const GenericLogic = await ethers.getContractFactory("GenericLogic", deployer);
      const genericLogic = await GenericLogic.deploy();
      await genericLogic.deployed();
      addresses.GenericLogic = genericLogic.address;
      console.log("Deploy GenericLogic at:", genericLogic.address);
    }

    if (addresses.ValidationLogic) {
      const validationLogic = await ethers.getContractAt("ValidationLogic", addresses.ValidationLogic, deployer);
      console.log("Found ValidationLogic at:", validationLogic.address);
    } else {
      const ValidationLogic = await ethers.getContractFactory("ValidationLogic", {
        signer: deployer,
        libraries: {
          GenericLogic: addresses.GenericLogic,
        },
      });
      const validationLogic = await ValidationLogic.deploy();
      await validationLogic.deployed();
      addresses.ValidationLogic = validationLogic.address;
      console.log("Deploy ValidationLogic at:", validationLogic.address);
    }

    if (addresses.ReserveLogic) {
      const reserveLogic = await ethers.getContractAt("ReserveLogic", addresses.ReserveLogic, deployer);
      console.log("Found ReserveLogic at:", reserveLogic.address);
    } else {
      const ReserveLogic = await ethers.getContractFactory("ReserveLogic", deployer);
      const reserveLogic = await ReserveLogic.deploy();
      await reserveLogic.deployed();
      addresses.ReserveLogic = reserveLogic.address;
      console.log("Deploy ReserveLogic at:", reserveLogic.address);
    }

    if (addresses.WalletBalanceProvider) {
      const walletBalanceProvider = await ethers.getContractAt(
        "WalletBalanceProvider",
        addresses.WalletBalanceProvider,
        deployer
      );
      console.log("Found WalletBalanceProvider at:", walletBalanceProvider.address);
    } else {
      const WalletBalanceProvider = await ethers.getContractFactory("WalletBalanceProvider", deployer);
      const walletBalanceProvider = await WalletBalanceProvider.deploy();
      await walletBalanceProvider.deployed();
      addresses.WalletBalanceProvider = walletBalanceProvider.address;
      console.log("Deploy WalletBalanceProvider at:", walletBalanceProvider.address);
    }

    if (addresses.WETHGateway) {
      const wethGateway = await ethers.getContractAt("WETHGateway", addresses.WETHGateway, deployer);
      console.log("Found WETHGateway at:", wethGateway.address);
    } else {
      const WETHGateway = await ethers.getContractFactory("WETHGateway", deployer);
      const wethGateway = await WETHGateway.deploy(addresses.WCFX);
      await wethGateway.deployed();
      addresses.WETHGateway = wethGateway.address;
      console.log("Deploy WETHGateway at:", wethGateway.address);
    }

    if (addresses.GoledoToken) {
      goledoToken = await ethers.getContractAt("GoledoToken", addresses.GoledoToken, deployer);
      console.log("Found GoledoToken at:", goledoToken.address);
    } else {
      const GoledoToken = await ethers.getContractFactory("GoledoToken", deployer);
      goledoToken = await GoledoToken.deploy(MAX_SUPPLY);
      await goledoToken.deployed();
      addresses.GoledoToken = goledoToken.address;
      console.log("Deploy GoledoToken at:", goledoToken.address);
    }

    if (addresses.LendingPoolAddressesProviderRegistry) {
      lendingPoolAddressesProviderRegistry = await ethers.getContractAt(
        "LendingPoolAddressesProviderRegistry",
        addresses.LendingPoolAddressesProviderRegistry,
        deployer
      );
      console.log("Found LendingPoolAddressesProviderRegistry at:", lendingPoolAddressesProviderRegistry.address);
    } else {
      const LendingPoolAddressesProviderRegistry = await ethers.getContractFactory(
        "LendingPoolAddressesProviderRegistry",
        deployer
      );
      lendingPoolAddressesProviderRegistry = await LendingPoolAddressesProviderRegistry.deploy();
      await lendingPoolAddressesProviderRegistry.deployed();
      addresses.LendingPoolAddressesProviderRegistry = lendingPoolAddressesProviderRegistry.address;
      console.log("Deploy LendingPoolAddressesProviderRegistry at:", lendingPoolAddressesProviderRegistry.address);
    }

    if (addresses.LendingPoolAddressesProvider) {
      lendingPoolAddressesProvider = await ethers.getContractAt(
        "LendingPoolAddressesProvider",
        addresses.LendingPoolAddressesProvider,
        deployer
      );
      console.log("Found LendingPoolAddressesProvider at:", lendingPoolAddressesProvider.address);
    } else {
      const LendingPoolAddressesProvider = await ethers.getContractFactory("LendingPoolAddressesProvider", deployer);
      lendingPoolAddressesProvider = await LendingPoolAddressesProvider.deploy("Goledo");
      await lendingPoolAddressesProvider.deployed();
      addresses.LendingPoolAddressesProvider = lendingPoolAddressesProvider.address;
      console.log("Deploy LendingPoolAddressesProvider at:", lendingPoolAddressesProvider.address);
    }

    if (
      (
        await lendingPoolAddressesProviderRegistry.getAddressesProviderIdByAddress(lendingPoolAddressesProvider.address)
      ).eq(constants.Zero)
    ) {
      const tx = await lendingPoolAddressesProviderRegistry.registerAddressesProvider(
        lendingPoolAddressesProvider.address,
        1
      );
      console.log(">> RegisterAddressesProvider in LendingPoolAddressesProviderRegistry, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> LendingPoolAddressesProvider already registered in LendingPoolAddressesProviderRegistry");
    }

    if ((await lendingPoolAddressesProvider.getPoolAdmin()) !== addresses.Admin) {
      const tx = await lendingPoolAddressesProvider.setPoolAdmin(addresses.Admin);
      console.log(">> SetPoolAdmin in LendingPoolAddressesProvider, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> PoolAdmin is already set in LendingPoolAddressesProvider");
    }

    if ((await lendingPoolAddressesProvider.getEmergencyAdmin()) !== addresses.Admin) {
      const tx = await lendingPoolAddressesProvider.setEmergencyAdmin(addresses.Admin);
      console.log(">> SetEmergencyAdmin in LendingPoolAddressesProvider, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> EmergencyAdmin is already set in LendingPoolAddressesProvider");
    }

    if (addresses.LendingPoolCollateralManager) {
      lendingPoolCollateralManager = await ethers.getContractAt(
        "LendingPoolCollateralManager",
        addresses.LendingPoolCollateralManager,
        deployer
      );
      console.log("Found LendingPoolCollateralManager at:", lendingPoolCollateralManager.address);
    } else {
      const LendingPoolCollateralManager = await ethers.getContractFactory("LendingPoolCollateralManager", deployer);
      lendingPoolCollateralManager = await LendingPoolCollateralManager.deploy();
      await lendingPoolCollateralManager.deployed();
      addresses.LendingPoolCollateralManager = lendingPoolCollateralManager.address;
      console.log("Deploy LendingPoolCollateralManager at:", lendingPoolCollateralManager.address);
    }

    if (
      (await lendingPoolAddressesProvider.getLendingPoolCollateralManager()) !== lendingPoolCollateralManager.address
    ) {
      const tx = await lendingPoolAddressesProvider.setLendingPoolCollateralManager(
        lendingPoolCollateralManager.address
      );
      console.log(">> SetLendingPoolCollateralManager in LendingPoolAddressesProvider, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> LendingPoolCollateralManager is already set in LendingPoolAddressesProvider");
    }

    if (addresses.LendingPool) {
      lendingPool = await ethers.getContractAt("LendingPool", addresses.LendingPool, deployer);
      console.log("Found LendingPool at:", lendingPool.address);
    } else {
      let impl: LendingPool;
      if (addresses.LendingPoolImpl === undefined) {
        const LendingPool = await ethers.getContractFactory("LendingPool", {
          signer: deployer,
          libraries: {
            ReserveLogic: addresses.ReserveLogic,
            ValidationLogic: addresses.ValidationLogic,
          },
        });
        impl = await LendingPool.deploy();
        await impl.deployed();
        addresses.LendingPoolImpl = impl.address;
        console.log("Deploy LendingPool Impl at:", impl.address);
      } else {
        impl = await ethers.getContractAt("LendingPool", addresses.LendingPoolImpl, deployer);
      }
      {
        const tx = await lendingPoolAddressesProvider.setLendingPoolImpl(impl.address);
        console.log(">> SetLendingPoolImpl in LendingPoolAddressesProvider, hash:", tx.hash);
        await tx.wait();
        console.log(">> ✅ Done");
      }
      const address = await lendingPoolAddressesProvider.getLendingPool();
      lendingPool = await ethers.getContractAt("LendingPool", address, deployer);
      console.log("Deploy LendingPool Proxy at:", lendingPool.address);
    }

    if (addresses.LendingPoolConfigurator) {
      lendingPoolConfigurator = await ethers.getContractAt(
        "LendingPoolConfigurator",
        addresses.LendingPoolConfigurator,
        deployer
      );
      console.log("Found LendingPoolConfigurator at:", lendingPoolConfigurator.address);
    } else {
      let impl: LendingPoolConfigurator;
      if (addresses.LendingPoolConfiguratorImpl === undefined) {
        const LendingPoolConfigurator = await ethers.getContractFactory("LendingPoolConfigurator", deployer);
        impl = await LendingPoolConfigurator.deploy();
        await impl.deployed();
        addresses.LendingPoolConfiguratorImpl = impl.address;
        console.log("Deploy LendingPoolConfigurator Impl at:", impl.address);
      } else {
        impl = await ethers.getContractAt("LendingPoolConfigurator", addresses.LendingPoolConfiguratorImpl, deployer);
      }
      {
        const tx = await lendingPoolAddressesProvider.setLendingPoolConfiguratorImpl(impl.address);
        console.log(">> SetLendingPoolConfiguratorImpl in LendingPoolAddressesProvider, hash:", tx.hash);
        await tx.wait();
        console.log(">> ✅ Done");
      }
      const address = await lendingPoolAddressesProvider.getLendingPoolConfigurator();
      lendingPoolConfigurator = await ethers.getContractAt("LendingPoolConfigurator", address, deployer);
      console.log("Deploy LendingPoolConfigurator Proxy at:", lendingPoolConfigurator.address);
    }

    if (addresses.AaveOracle) {
      aaveOracle = await ethers.getContractAt("AaveOracle", addresses.AaveOracle, deployer);
      console.log("Found AaveOracle at:", aaveOracle.address);
    } else {
      const AaveOracle = await ethers.getContractFactory("AaveOracle", deployer);
      aaveOracle = await AaveOracle.deploy([], []);
      await aaveOracle.deployed();
      addresses.AaveOracle = aaveOracle.address;
      console.log("Deploy AaveOracle at:", aaveOracle.address);
    }

    if ((await lendingPoolAddressesProvider.getPriceOracle()) !== aaveOracle.address) {
      const tx = await lendingPoolAddressesProvider.setPriceOracle(aaveOracle.address);
      console.log(">> SetPriceOracle in LendingPoolAddressesProvider, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> PriceOracle is already set in LendingPoolAddressesProvider");
    }

    if (addresses.LendingRateOracle) {
      lendingRateOracle = await ethers.getContractAt("LendingRateOracle", addresses.LendingRateOracle, deployer);
      console.log("Found LendingRateOracle at:", lendingRateOracle.address);
    } else {
      const LendingRateOracle = await ethers.getContractFactory("LendingRateOracle", deployer);
      lendingRateOracle = await LendingRateOracle.deploy();
      await lendingRateOracle.deployed();
      addresses.LendingRateOracle = lendingRateOracle.address;
      console.log("Deploy LendingRateOracle at:", lendingRateOracle.address);
    }

    if ((await lendingPoolAddressesProvider.getLendingRateOracle()) !== lendingRateOracle.address) {
      const tx = await lendingPoolAddressesProvider.setLendingRateOracle(lendingRateOracle.address);
      console.log(">> SetLendingRateOracle in LendingPoolAddressesProvider, hash:", tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    } else {
      console.log(">> LendingRateOracle is already set in LendingPoolAddressesProvider");
    }

    if (addresses.AaveProtocolDataProvider) {
      aaveProtocolDataProvider = await ethers.getContractAt(
        "AaveProtocolDataProvider",
        addresses.AaveProtocolDataProvider,
        deployer
      );
      console.log("Found AaveProtocolDataProvider at:", aaveProtocolDataProvider.address);
    } else {
      const AaveProtocolDataProvider = await ethers.getContractFactory("AaveProtocolDataProvider", deployer);
      aaveProtocolDataProvider = await AaveProtocolDataProvider.deploy(lendingPoolAddressesProvider.address);
      await aaveProtocolDataProvider.deployed();
      addresses.AaveProtocolDataProvider = aaveProtocolDataProvider.address;
      console.log("Deploy AaveProtocolDataProvider at:", aaveProtocolDataProvider.address);
    }

    // @note check if we need to set AaveProtocolDataProvider in LendingPoolAddressesProvider

    if (addresses.MultiFeeDistribution) {
      multiFeeDistribution = await ethers.getContractAt(
        "MultiFeeDistribution",
        addresses.MultiFeeDistribution,
        deployer
      );
      console.log("Found MultiFeeDistribution at:", multiFeeDistribution.address);
    } else {
      const MultiFeeDistribution = await ethers.getContractFactory("MultiFeeDistribution", deployer);
      multiFeeDistribution = await MultiFeeDistribution.deploy(goledoToken.address);
      await multiFeeDistribution.deployed();
      addresses.MultiFeeDistribution = multiFeeDistribution.address;
      console.log("Deploy MultiFeeDistribution at:", multiFeeDistribution.address);
    }

    if (addresses.ChefIncentivesController) {
      chefIncentivesController = await ethers.getContractAt(
        "ChefIncentivesController",
        addresses.ChefIncentivesController,
        deployer
      );
      console.log("Found ChefIncentivesController at:", chefIncentivesController.address);
    } else {
      const ChefIncentivesController = await ethers.getContractFactory("ChefIncentivesController", deployer);
      chefIncentivesController = await ChefIncentivesController.deploy(
        [1654041600],
        [ethers.utils.parseEther("10")],
        lendingPoolConfigurator.address,
        multiFeeDistribution.address,
        MAX_SUPPLY.mul(4).div(10)
      );
      await chefIncentivesController.deployed();
      addresses.ChefIncentivesController = chefIncentivesController.address;
      console.log("Deploy ChefIncentivesController at:", chefIncentivesController.address);
    }

    if (addresses.MasterChef) {
      masterChef = await ethers.getContractAt("MasterChef", addresses.MasterChef, deployer);
      console.log("Found MasterChef at:", masterChef.address);
    } else {
      const MasterChef = await ethers.getContractFactory("MasterChef", deployer);
      masterChef = await MasterChef.deploy(
        [1654041600],
        [ethers.utils.parseEther("5")],
        lendingPoolConfigurator.address,
        multiFeeDistribution.address,
        MAX_SUPPLY.mul(2).div(10)
      );
      await masterChef.deployed();
      addresses.MasterChef = masterChef.address;
      console.log("Deploy MasterChef at:", masterChef.address);
    }

    if (addresses.UiPoolDataProvider) {
      const uiPoolDataProvider = await ethers.getContractAt(
        "UiPoolDataProvider",
        addresses.UiPoolDataProvider,
        deployer
      );
      console.log("Found UiPoolDataProvider at:", uiPoolDataProvider.address);
    } else {
      const UiPoolDataProvider = await ethers.getContractFactory("UiPoolDataProvider", deployer);
      const uiPoolDataProvider = await UiPoolDataProvider.deploy(chefIncentivesController.address, aaveOracle.address);
      await uiPoolDataProvider.deployed();
      addresses.UiPoolDataProvider = uiPoolDataProvider.address;
      console.log("Deploy UiPoolDataProvider at:", uiPoolDataProvider.address);
    }

    if (addresses.ATokenImpl) {
      const impl = await ethers.getContractAt("AToken", addresses.ATokenImpl, deployer);
      console.log("Found AToken Impl at:", impl.address);
    } else {
      const AToken = await ethers.getContractFactory("AToken", deployer);
      const impl = await AToken.deploy();
      await impl.deployed();
      addresses.ATokenImpl = impl.address;
      console.log("Deploy AToken Impl at:", impl.address);
    }

    if (addresses.StableDebtTokenImpl) {
      const impl = await ethers.getContractAt("StableDebtToken", addresses.StableDebtTokenImpl, deployer);
      console.log("Found StableDebtToken Impl at:", impl.address);
    } else {
      const StableDebtToken = await ethers.getContractFactory("StableDebtToken", deployer);
      const impl = await StableDebtToken.deploy();
      await impl.deployed();
      addresses.StableDebtTokenImpl = impl.address;
      console.log("Deploy StableDebtToken Impl at:", impl.address);
    }

    if (addresses.VariableDebtTokenImpl) {
      const impl = await ethers.getContractAt("VariableDebtToken", addresses.VariableDebtTokenImpl, deployer);
      console.log("Found VariableDebtToken Impl at:", impl.address);
    } else {
      const VariableDebtToken = await ethers.getContractFactory("VariableDebtToken", deployer);
      const impl = await VariableDebtToken.deploy();
      await impl.deployed();
      addresses.VariableDebtTokenImpl = impl.address;
      console.log("Deploy VariableDebtToken Impl at:", impl.address);
    }

    if (addresses.DefaultReserveInterestRateStrategy) {
      const defaultReserveInterestRateStrategy = await ethers.getContractAt(
        "DefaultReserveInterestRateStrategy",
        addresses.DefaultReserveInterestRateStrategy,
        deployer
      );
      console.log("Found DefaultReserveInterestRateStrategy at:", defaultReserveInterestRateStrategy.address);
    } else {
      const DefaultReserveInterestRateStrategy = await ethers.getContractFactory(
        "DefaultReserveInterestRateStrategy",
        deployer
      );
      const defaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(
        lendingPoolAddressesProvider.address,
        "450000000000000050000000000", // optimalUtilizationRate
        "0", // baseVariableBorrowRate
        "70000000000000010000000000", // variableRateSlope1
        "3000000000000000000000000000", // variableRateSlope2
        "0", // stableRateSlope1
        "0" // stableRateSlope2
      );
      await defaultReserveInterestRateStrategy.deployed();
      addresses.DefaultReserveInterestRateStrategy = defaultReserveInterestRateStrategy.address;
      console.log("Deploy DefaultReserveInterestRateStrategy at:", defaultReserveInterestRateStrategy.address);
    }

    addresses.Markets.CFX.token = goledoToken.address;
    for (const token of ["CFX"]) {
      const market = addresses.Markets[token];
      if (market.atoken === undefined) {
        const tx = await lendingPoolConfigurator.batchInitReserve([
          {
            aTokenImpl: addresses.ATokenImpl!,
            stableDebtTokenImpl: addresses.StableDebtTokenImpl!,
            variableDebtTokenImpl: addresses.VariableDebtTokenImpl!,
            underlyingAssetDecimals: market.decimals,
            interestRateStrategyAddress: addresses.DefaultReserveInterestRateStrategy!,
            underlyingAsset: market.token,
            treasury: addresses.Treasury,
            incentivesController: chefIncentivesController.address,
            allocPoint: 1,
            underlyingAssetName: token,
            aTokenName: `Goledo interest bearing ${token}`,
            aTokenSymbol: `g${token}`,
            variableDebtTokenName: `Goledo variable debt bearing ${token}`,
            variableDebtTokenSymbol: `variableDebt${token}`,
            stableDebtTokenName: `Goledo stable debt bearing ${token}`,
            stableDebtTokenSymbol: `stableDebt${token}`,
            params: [],
          },
        ]);
        console.log(`>> Deploying ${token} market, hash:`, tx.hash);
        await tx.wait();
        console.log(">> ✅ Done");

        const reserveData = await lendingPool.getReserveData(market.token);
        console.log(
          `Market[${token}] aToken[${reserveData.aTokenAddress}]`,
          `sToken[${reserveData.stableDebtTokenAddress}]`,
          `vToken[${reserveData.variableDebtTokenAddress}]`
        );
      }
    }
  });

  it("should", async () => {
    const [deployer] = await ethers.getSigners();
    const addresses = ADDRESSES.testnet;
    await multiFeeDistribution.exit(false);
    //const uiPoolDataProvider = await ethers.getContractAt("UiPoolDataProvider", addresses.UiPoolDataProvider!, deployer);
    //console.log("Found UiPoolDataProvider at:", uiPoolDataProvider.address);
    //console.log(await uiPoolDataProvider.getSimpleReservesData(addresses.LendingPoolAddressesProvider!));
  });
});
