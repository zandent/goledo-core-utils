import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 60000000,
    },
    espace: {
      url: "https://evm.confluxrpc.com	",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    testnet: {
      url: "https://evmtestnet.confluxrpc.com",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    // ftm network is for testing geistTest.ts
    ftm: {
      url: "https://rpc.fantom.network",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  paths: {
    cache: "./cache",
    artifacts: "./artifacts",
    sources: "./contracts",
    tests: "./test",
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 800000,
  },
};

export default config;
