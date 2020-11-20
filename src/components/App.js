import React, { Component } from 'react';
import getWeb3 from './getWeb3';
import Navbar from './Navbar';
import Main from './Main';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      stakeToken: 0,
      unstakeToken: 0,
      loading: true,
    };
  }

  componentDidMount = async () => {
    // Get network provider and web3 instance.
    this.web3 = await getWeb3();
    let accounts = await this.web3.eth.getAccounts();

    const networkID = await this.web3.eth.net.getId();
    console.log('networkID', networkID);

    const daiToken = new this.web3.eth.Contract(
      DaiToken.abi,
      DaiToken.networks[networkID].address
    );
    let daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call();
    console.log('daiTokenBalance', daiTokenBalance);

    const dappToken = new this.web3.eth.Contract(
      DappToken.abi,
      DappToken.networks[networkID].address
    );
    let dappTokenBalance = await dappToken.methods
      .balanceOf(accounts[0])
      .call();
    console.log('dappTokenBalance', dappTokenBalance);

    const tokenFarm = new this.web3.eth.Contract(
      TokenFarm.abi,
      TokenFarm.networks[networkID].address
    );
    // let stakeAmount = this.web3.utils.toWei('100', 'ether');
    // let stakeTokens = await tokenFarm.methods
    //   .stakeTokens(stakeAmount)
    //   .send({ from: accounts[0] });
    let stakingBalance = await tokenFarm.methods
      .stakingBalance(accounts[0])
      .call();
    console.log('stakingBalance', stakingBalance);

    this.setState({
      account: accounts[0],
      daiToken,
      dappToken,
      tokenFarm,
      daiTokenBalance: this.web3.utils.fromWei(daiTokenBalance, 'ether'),
      dappTokenBalance: this.web3.utils.fromWei(dappTokenBalance, 'ether'),
      stakingBalance: this.web3.utils.fromWei(stakingBalance, 'ether'),
      loading: false,
    });
  };

  stakeTokens = (amount) => {
    amount = this.web3.utils.toWei(amount, 'ether');
    this.setState({ loading: true });
    this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.setState({ loading: false, stakeToken: amount });
          });
      });
  };

  unstakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.tokenFarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on('transactionHash', async (hash) => {
        let unStakeAmount = await this.state.daiToken.methods
          .balanceOf(this.state.account)
          .call();
        this.setState({ loading: false, unstakeToken: unStakeAmount });
      });
  };

  issueToken = async () => {
    await this.state.tokenFarm.methods
      .issueToken()
      .send({ from: this.state.account });
    let getDappTokenAfterStake = await this.state.dappToken.methods
      .balanceOf(this.state.account)
      .call();
    getDappTokenAfterStake = this.web3.utils.fromWei(
      getDappTokenAfterStake,
      'ether'
    );
    this.setState({ dappTokenBalance: getDappTokenAfterStake });
  };

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id='loader' className='text-center'>
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          daiTokenBalance={this.state.daiTokenBalance}
          dappTokenBalance={this.state.dappTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.stakeTokens}
          unstakeTokens={this.unstakeTokens}
          issueToken={this.issueToken}
        />
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main
              role='main'
              className='col-lg-12 ml-auto mr-auto'
              style={{ maxWidth: '600px' }}
            >
              <div className='content mr-auto ml-auto'>
                <a href='/' target='_blank' rel='noopener noreferrer'></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
