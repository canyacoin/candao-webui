const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = 'eagle mother despair gown tool foam attract cheese space bullet retreat connect';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/Pjuqwe1f8zc0UUwAkZRJ'),
      network_id: '3',
      gas: 1828127,
      // gasPrice: 90000000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
