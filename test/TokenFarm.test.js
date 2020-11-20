const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

const { assert } = require('chai');
const chai = require('chai');
const chaipromiss = require('chai-as-promised');
const web3 = require('web3');
chai.use(chaipromiss).should();
const expect = chai.expect;

// require('chai')
//   .use(require('chai-as-promised'))
//   .should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', (accounts) => {
  let daiToken, dappToken, tokenFarm;
  let [owner, investor] = accounts;

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //transfer all dapp token to farmtoken
    dappToken.transfer(tokenFarm.address, tokens('1000000'));

    //send 100 mDai tokens to account1.
    daiToken.transfer(investor, tokens('100'));
  });

  it('has a name', async () => {
    let daiToken = await DaiToken.new();
    assert(await daiToken.name(), 'Mock DAI Token');
  });

  it('make sure tokenFarm have all dapp token', async () => {
    let balance = await dappToken.balanceOf(tokenFarm.address);
    assert.equal(balance.toString(), tokens('1000000'));
  });

  it('stake token', async () => {
    let balance = await daiToken.balanceOf(investor);
    assert.equal(balance.toString(), tokens('100'));

    // allow contract spend money
    await daiToken.approve(tokenFarm.address, tokens('100'), {
      from: investor,
    });

    await tokenFarm.stakeTokens(tokens('100'), {
      from: investor,
    });

    balance = await daiToken.balanceOf(investor);
    assert.equal(balance.toString(), '0', 'transfer 100% mDai token to Farm');

    balance = await daiToken.balanceOf(tokenFarm.address);
    assert.equal(balance.toString(), tokens('100'), 'Stacked success.');
  });

  it('issue token', async () => {
    await tokenFarm.issueToken({
      from: investor,
    });
    balance = await dappToken.balanceOf(investor);
    assert.equal(balance.toString(), tokens('100'), 'ok after issue token');
  });

  it('unstake token', async () => {
    await tokenFarm.unStake({
      from: investor,
    });

    let balance = await daiToken.balanceOf(investor);
    assert.equal(
      balance.toString(),
      tokens('100'),
      'return 100 mDai to investor'
    );

    balance = await daiToken.balanceOf(tokenFarm.address);
    assert.equal(balance.toString(), '0', 'TokenFarm must have 0 mDai Token.');
  });
});
