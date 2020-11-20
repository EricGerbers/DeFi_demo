const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  const dappTotalSupply = await dappToken.totalSupply();
  console.log('dappTotalSupply:', dappTotalSupply.toString());

  // transfer all DappToken to tokenFarm.
  await dappToken.transfer(tokenFarm.address, dappTotalSupply);

  const checkDappTokenFarm = await dappToken.balanceOf(tokenFarm.address);
  console.log('check Token dapp for contract:', checkDappTokenFarm.toString());

  // transfer 100 daiToken to invertor.
  // await daiToken.transfer(accounts[1], '100000000000000000000');
};
