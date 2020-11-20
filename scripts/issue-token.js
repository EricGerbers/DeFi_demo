const TokenFarm = artifacts.require('TokenFarm');

// chay file nay trong truffle bang lenh
// truffle exec scripts/issue-token.js
module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueToken();

  console.log('Tokens issued!');
  callback();
};
