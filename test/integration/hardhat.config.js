require("@nomiclabs/hardhat-ethers");
require('solidity-coverage');
// require("@nomiclabs/hardhat-etherscan");

const LUKSO_RPC_URL = "https://rpc.l16.lukso.network"
const PRIVATE_KEY = process.env.devTestnetPrivateKey

module.exports = {
  defaultNetwork: "lukso",
  networks: {
    hardhat: {
    },
    lukso: {
      url: LUKSO_RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  // etherscan: {
  //   apiKey: process.env.PolyscanApiKey
  // },
  solidity: {
    compilers: [{version: "0.8.0"},
    {version: "0.8.7"},
    {version: "0.8.16"},
    {version: "0.6.6"}],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 3000000
  }
}
