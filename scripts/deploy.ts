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
  WETHGateway,
} from "../typechain";

const ADDRESSES: {
  [network: string]: {
    Admin: string;
    EmergencyAdmin: string;
    Treasury: string;
    WitnetRouter: string;
    WCFX: string;
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
    Admin: "0x121f7b3F158A2331a964Fc9cBa092fb64B464A41",
    EmergencyAdmin: "0x121f7b3F158A2331a964Fc9cBa092fb64B464A41",
    Treasury: "0x121f7b3F158A2331a964Fc9cBa092fb64B464A41",
    WitnetRouter: "0x49c0bcce51a8b28f92d008394f06d5b259657f33",
    WCFX: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
    GenericLogic: "0x5dBe0d7Ac3F54F55Efa25e88298c53aF2c877994",
    ValidationLogic: "0xd1619395E21e01C4eAe8Dd945908Cf364B6289e7",
    ReserveLogic: "0x1079E3C99Afdeb6978f3Af33BE50f2C302f4577c",
    WalletBalanceProvider: "0xB14B6110452D2B5730f8CDa74e1C1e533969a8cb",
    WETHGateway: "0x7fd31999daEF36C0a33D4E7EBc82cB8461aF533d",
    GoledoToken: "0x825c33cDc4C5a985Ca85Ab6a88049c423fB6E53E",
    LendingPoolAddressesProviderRegistry: "0xC6B3E044204555a74aa6B7838E72B3FF7a292a59",
    LendingPoolAddressesProvider: "0x023619D3df82473e249bD8ccEcc44C5610b58b86",
    LendingPoolCollateralManager: "0x9464190E27425fDFD965E789B9855FE3Bf57C206",
    LendingPoolImpl: "0xEEfbA718bA7aCA702c7953202E193112664917cA",
    LendingPool: "0xB31cc812a2A868A8F9C0e09a6A316922c9C1e163",
    LendingPoolConfiguratorImpl: "0x5A5CA10cc23845eC1B98b876A03526517440fB82",
    LendingPoolConfigurator: "0xDEDa491821101250E7D07a2C55FC885d347CbC3D",
    AaveOracle: "0x8AF54B0C6591E21A7E2b764a27CC007966F561db",
    LendingRateOracle: "0x6932Af4356393F31e7D81d3Afccd72A7Fae25D7d",
    AaveProtocolDataProvider: "0xa7B8248D5F11a0e6f57364ff3E776237Ec17404D",
    MultiFeeDistribution: "0x4E57aE057ced065BBF8a9039e29575168033122B",
    ChefIncentivesController: "0xFb6a7A25049C71Ac559d7dA40457D60f036052a9",
    MasterChef: "0x4F3286BeBC329A0D222F21de44a92Df235558208",
    UiPoolDataProvider: "0xCbc16C9F92C4Abee9b04fF3137Cf43fbAc274328",
    IncentiveDataProvider: "0x821760efC34A7586Ce26410062B381AB00ED7948",
    ATokenImpl: "0x91Bb88cCAd90508A548364f416E54240Cdf65282",
    StableDebtTokenImpl: "0xDD414919F3b131fDF9D19D47aC9AD307Bf09c68c",
    VariableDebtTokenImpl: "0x5E77189F66b726b41192a70afD4429781aC6f318",
    DefaultReserveInterestRateStrategy: "0x0C7888850Ed658CeFB5004b5C96ce180A4D5188e",
    SwappiLP: "0xfd8742ccec4b37b5cbafe0e3471ae846024fcce4",
    Markets: {
      CFX: {
        token: "0x2ed3dddae5b2f321af0806181fbfa6d049be47d8",
        decimals: 18,
        atoken: "0xbB95Fdc15B2ccDab60B1403f225d3f8182f521ef",
        stoken: "0x610ee7167EA1E629C47704520CdCAa73D37CEf0A",
        vtoken: "0xC8B9c0258BB61fCBb230eC6DBcA019CC944Ea023",
        oracle: "0xcad6CD7E8389E9479306FcFC9078f0995a974Db0",
        witnetConfig: {
          assetId: "0x65784185a07d3add5e7a99a6ddd4477e3c8caad717bac3ba3c3361d99a978c29",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      WETH: {
        token: "0xcd71270f82f319e0498ff98af8269c3f0d547c65",
        decimals: 18,
        atoken: "0x3DFd75f637FC34Bb91cFA090689e11E930675872",
        stoken: "0x629b9c64BfE31efF3c1C7CEC5dcD8C3501c69350",
        vtoken: "0x968Fb900E8c3CB9CCB1D5c3a6e89310CABdd772F",
        oracle: "0x885887bdF4757743FF1c966FEA7BBa07dc186E76",
        witnetConfig: {
          assetId: "0x3d15f7018db5cc80838b684361aaa100bfadf8a11e02d5c1c92e9c6af47626c8",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      WBTC: {
        token: "0x54593e02c39aeff52b166bd036797d2b1478de8d",
        decimals: 18,
        atoken: "0x7E435499eaE1dfFb5DA6f8164B3132df55326c7f",
        stoken: "0x189Dc84dEb8bB3eDC0b7596aAfFA382921535581",
        vtoken: "0x87446f0Bcb285562463bAA22dA0813087215AEf6",
        oracle: "0x6Ab90278a7b92e584e3D504004d537a12E9A851f",
        witnetConfig: {
          assetId: "0x24beead43216e490aa240ef0d32e18c57beea168f06eabb94f5193868d500946",
          decimals: 6,
          timeout: 60 * 60 * 2,
        },
      },
      USDT: {
        token: "0x7d682e65efc5c13bf4e394b8f376c48e6bae0355",
        decimals: 18,
        atoken: "0x9E9D93b39437F7c6ecD7Bf4e52E9a24c50E20FE8",
        stoken: "0x18C5c3b8e9d38058f2E33Ff988409cf24674c9E9",
        vtoken: "0x153A9AE93b7A0A16094591AC187BD7dd3859F703",
        oracle: "0xd111b610E11A1657865ee0415cE47f1B54a87308",
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
  const addresses = ADDRESSES[network.name];

  if (addresses.GenericLogic !== "") {
    const genericLogic = await ethers.getContractAt("GenericLogic", addresses.GenericLogic, deployer);
    console.log("Found GenericLogic at:", genericLogic.address);
  } else {
    const GenericLogic = await ethers.getContractFactory("GenericLogic", deployer);
    const genericLogic = await GenericLogic.deploy();
    await genericLogic.deployed();
    addresses.GenericLogic = genericLogic.address;
    console.log("Deploy GenericLogic at:", genericLogic.address);
  }

  if (addresses.ValidationLogic !== "") {
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

  if (addresses.ReserveLogic !== "") {
    const reserveLogic = await ethers.getContractAt("ReserveLogic", addresses.ReserveLogic, deployer);
    console.log("Found ReserveLogic at:", reserveLogic.address);
  } else {
    const ReserveLogic = await ethers.getContractFactory("ReserveLogic", deployer);
    const reserveLogic = await ReserveLogic.deploy();
    await reserveLogic.deployed();
    addresses.ReserveLogic = reserveLogic.address;
    console.log("Deploy ReserveLogic at:", reserveLogic.address);
  }

  if (addresses.WalletBalanceProvider !== "") {
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

  if (addresses.WETHGateway !== "") {
    wethGateway = await ethers.getContractAt("WETHGateway", addresses.WETHGateway, deployer);
    console.log("Found WETHGateway at:", wethGateway.address);
  } else {
    const WETHGateway = await ethers.getContractFactory("WETHGateway", deployer);
    wethGateway = await WETHGateway.deploy(addresses.WCFX);
    await wethGateway.deployed();
    addresses.WETHGateway = wethGateway.address;
    console.log("Deploy WETHGateway at:", wethGateway.address);
  }

  if (addresses.GoledoToken !== "") {
    goledoToken = await ethers.getContractAt("GoledoToken", addresses.GoledoToken, deployer);
    console.log("Found GoledoToken at:", goledoToken.address);
  } else {
    const GoledoToken = await ethers.getContractFactory("GoledoToken", deployer);
    goledoToken = await GoledoToken.deploy(MAX_SUPPLY);
    await goledoToken.deployed();
    addresses.GoledoToken = goledoToken.address;
    console.log("Deploy GoledoToken at:", goledoToken.address);
  }

  if (addresses.LendingPoolAddressesProviderRegistry !== "") {
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

  if (addresses.LendingPoolAddressesProvider !== "") {
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

  if ((await lendingPoolAddressesProvider.getEmergencyAdmin()) !== addresses.EmergencyAdmin) {
    const tx = await lendingPoolAddressesProvider.setEmergencyAdmin(addresses.EmergencyAdmin);
    console.log(">> SetEmergencyAdmin in LendingPoolAddressesProvider, hash:", tx.hash);
    await tx.wait();
    console.log(">> ✅ Done");
  } else {
    console.log(">> EmergencyAdmin is already set in LendingPoolAddressesProvider");
  }

  if (addresses.LendingPoolCollateralManager !== "") {
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

  if ((await lendingPoolAddressesProvider.getLendingPoolCollateralManager()) !== lendingPoolCollateralManager.address) {
    const tx = await lendingPoolAddressesProvider.setLendingPoolCollateralManager(lendingPoolCollateralManager.address);
    console.log(">> SetLendingPoolCollateralManager in LendingPoolAddressesProvider, hash:", tx.hash);
    await tx.wait();
    console.log(">> ✅ Done");
  } else {
    console.log(">> LendingPoolCollateralManager is already set in LendingPoolAddressesProvider");
  }

  if (addresses.LendingPool !== "") {
    lendingPool = await ethers.getContractAt("LendingPool", addresses.LendingPool, deployer);
    console.log("Found LendingPool at:", lendingPool.address);
  } else {
    let impl: LendingPool;
    if (addresses.LendingPoolImpl === "") {
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

  if (addresses.LendingPoolConfigurator !== "") {
    lendingPoolConfigurator = await ethers.getContractAt(
      "LendingPoolConfigurator",
      addresses.LendingPoolConfigurator,
      deployer
    );
    console.log("Found LendingPoolConfigurator at:", lendingPoolConfigurator.address);
  } else {
    let impl: LendingPoolConfigurator;
    if (addresses.LendingPoolConfiguratorImpl === "") {
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

  if (addresses.AaveOracle !== "") {
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

  if (addresses.LendingRateOracle !== "") {
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

  if (addresses.AaveProtocolDataProvider !== "") {
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

  if (addresses.MultiFeeDistribution !== "") {
    multiFeeDistribution = await ethers.getContractAt("MultiFeeDistribution", addresses.MultiFeeDistribution, deployer);
    console.log("Found MultiFeeDistribution at:", multiFeeDistribution.address);
  } else {
    const MultiFeeDistribution = await ethers.getContractFactory("MultiFeeDistribution", deployer);
    multiFeeDistribution = await MultiFeeDistribution.deploy(goledoToken.address);
    await multiFeeDistribution.deployed();
    addresses.MultiFeeDistribution = multiFeeDistribution.address;
    console.log("Deploy MultiFeeDistribution at:", multiFeeDistribution.address);
  }

  if (addresses.ChefIncentivesController !== "") {
    chefIncentivesController = await ethers.getContractAt(
      "ChefIncentivesController",
      addresses.ChefIncentivesController,
      deployer
    );
    console.log("Found ChefIncentivesController at:", chefIncentivesController.address);
  } else {
    const ChefIncentivesController = await ethers.getContractFactory("ChefIncentivesController", deployer);
    chefIncentivesController = await ChefIncentivesController.deploy(
      [0],
      [ethers.utils.parseEther("10")],
      lendingPoolConfigurator.address,
      multiFeeDistribution.address,
      MAX_SUPPLY.mul(4).div(10)
    );
    await chefIncentivesController.deployed();
    addresses.ChefIncentivesController = chefIncentivesController.address;
    console.log("Deploy ChefIncentivesController at:", chefIncentivesController.address);
    await chefIncentivesController.start();
  }

  if ((await multiFeeDistribution.incentivesController()) !== chefIncentivesController.address) {
    const tx = await multiFeeDistribution.setIncentivesController(chefIncentivesController.address);
    console.log(`>> SetIncentivesController in MultiFeeDistribution, hash:`, tx.hash);
    await tx.wait();
    console.log(">> ✅ Done");
  }

  if (addresses.MasterChef !== "") {
    masterChef = await ethers.getContractAt("MasterChef", addresses.MasterChef, deployer);
    console.log("Found MasterChef at:", masterChef.address);
    console.log(await masterChef.poolInfo(addresses.SwappiLP));
    console.log(await masterChef.totalAllocPoint());
    console.log(await masterChef.rewardsPerSecond());
  } else {
    const MasterChef = await ethers.getContractFactory("MasterChef", deployer);
    masterChef = await MasterChef.deploy(
      [0],
      [ethers.utils.parseEther("5")],
      lendingPoolConfigurator.address,
      multiFeeDistribution.address,
      MAX_SUPPLY.mul(2).div(10)
    );
    await masterChef.deployed();
    addresses.MasterChef = masterChef.address;
    console.log("Deploy MasterChef at:", masterChef.address);
    await masterChef.start();
  }

  if (addresses.UiPoolDataProvider !== "") {
    const uiPoolDataProvider = await ethers.getContractAt("UiPoolDataProvider", addresses.UiPoolDataProvider, deployer);
    console.log("Found UiPoolDataProvider at:", uiPoolDataProvider.address);
    // console.log(await uiPoolDataProvider.getSimpleReservesData(addresses.LendingPoolAddressesProvider));
  } else {
    const UiPoolDataProvider = await ethers.getContractFactory("UiPoolDataProvider", deployer);
    const uiPoolDataProvider = await UiPoolDataProvider.deploy(constants.AddressZero, aaveOracle.address);
    await uiPoolDataProvider.deployed();
    addresses.UiPoolDataProvider = uiPoolDataProvider.address;
    console.log("Deploy UiPoolDataProvider at:", uiPoolDataProvider.address);
  }

  if (addresses.IncentiveDataProvider !== "") {
    const incentiveDataProvider = await ethers.getContractAt(
      "IncentiveDataProvider",
      addresses.IncentiveDataProvider,
      deployer
    );
    console.log("Found IncentiveDataProvider at:", incentiveDataProvider.address);
    // console.log(await incentiveDataProvider.getUserIncentive("0x121f7b3F158A2331a964Fc9cBa092fb64B464A41"));
  } else {
    const IncentiveDataProvider = await ethers.getContractFactory("IncentiveDataProvider", deployer);
    const incentiveDataProvider = await IncentiveDataProvider.deploy(
      addresses.ChefIncentivesController,
      addresses.MasterChef,
      addresses.MultiFeeDistribution
    );
    await incentiveDataProvider.deployed();
    addresses.IncentiveDataProvider = incentiveDataProvider.address;
    console.log("Deploy IncentiveDataProvider at:", incentiveDataProvider.address);
  }

  if (addresses.ATokenImpl !== "") {
    const impl = await ethers.getContractAt("AToken", addresses.ATokenImpl, deployer);
    console.log("Found AToken Impl at:", impl.address);
  } else {
    const AToken = await ethers.getContractFactory("AToken", deployer);
    const impl = await AToken.deploy();
    await impl.deployed();
    addresses.ATokenImpl = impl.address;
    console.log("Deploy AToken Impl at:", impl.address);
  }

  if (addresses.StableDebtTokenImpl !== "") {
    const impl = await ethers.getContractAt("StableDebtToken", addresses.StableDebtTokenImpl, deployer);
    console.log("Found StableDebtToken Impl at:", impl.address);
  } else {
    const StableDebtToken = await ethers.getContractFactory("StableDebtToken", deployer);
    const impl = await StableDebtToken.deploy();
    await impl.deployed();
    addresses.StableDebtTokenImpl = impl.address;
    console.log("Deploy StableDebtToken Impl at:", impl.address);
  }

  if (addresses.VariableDebtTokenImpl !== "") {
    const impl = await ethers.getContractAt("VariableDebtToken", addresses.VariableDebtTokenImpl, deployer);
    console.log("Found VariableDebtToken Impl at:", impl.address);
  } else {
    const VariableDebtToken = await ethers.getContractFactory("VariableDebtToken", deployer);
    const impl = await VariableDebtToken.deploy();
    await impl.deployed();
    addresses.VariableDebtTokenImpl = impl.address;
    console.log("Deploy VariableDebtToken Impl at:", impl.address);
  }

  if (addresses.DefaultReserveInterestRateStrategy !== "") {
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

  for (const token of ["CFX", "USDT", "WETH", "WBTC"]) {
    const market = addresses.Markets[token];
    if (market.atoken === "") {
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
    if (market.oracle === "") {
      const WitnetPriceFeed = await ethers.getContractFactory("WitnetPriceFeed", deployer);
      const oracle = await WitnetPriceFeed.deploy(
        addresses.WitnetRouter,
        market.witnetConfig.assetId,
        market.witnetConfig.decimals,
        market.witnetConfig.timeout
      );
      await oracle.deployed();
      console.log(`Deploy Oracle for [${token}] at:`, oracle.address);
      market.oracle = oracle.address;
    }
    if ((await aaveOracle.getSourceOfAsset(market.token)) !== market.oracle) {
      const tx = await aaveOracle.setAssetSources([market.token], [market.oracle]);
      console.log(`>> SetAssetSources in AaveOracle for ${token}, hash:`, tx.hash);
      await tx.wait();
      console.log(">> ✅ Done");
    }
  }

  /*await wethGateway.authorizeLendingPool(addresses.LendingPool);
  // await multiFeeDistribution.mint(deployer.address, ethers.utils.parseEther("100"), false);
  await multiFeeDistribution.setMinters([addresses.MasterChef, addresses.ChefIncentivesController, deployer.address]);

  await lendingPoolConfigurator.enableBorrowingOnReserve(addresses.Markets.CFX.token, true);
  await lendingPoolConfigurator.enableBorrowingOnReserve(addresses.Markets.USDT.token, true);
  await lendingPoolConfigurator.enableBorrowingOnReserve(addresses.Markets.WETH.token, true);
  await lendingPoolConfigurator.enableBorrowingOnReserve(addresses.Markets.WBTC.token, true);
  await aaveOracle.setAssetSources(["0x000000000000000000000000000000000000dead"], [addresses.Markets.USDT.oracle]);
  await lendingPoolConfigurator.configureReserveAsCollateral(addresses.Markets.CFX.token, 5000, 6500, 11000);*/
  // await masterChef.addPool(addresses.SwappiLP, 1);
  await lendingPoolConfigurator.configureReserveAsCollateral(addresses.Markets.USDT.token, 8000, 8500, 10500);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
