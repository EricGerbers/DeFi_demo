require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          'gloom two ripple inspire subject rescue century science prison before fragile hand',
          'https://rinkeby.infura.io/v3/461ae29f1e0f4509bbe4fe9bf0440fd4',
          0
        );
      },
      network_id: 4,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      //version: '0.5.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'petersburg',
    },
  },
};
