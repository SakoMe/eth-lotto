import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = { manager: '', players: [], balance: '', value: '', message: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on the trasaction to go through' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'Success, you are now entered into the draw' });
  };

  pickAWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on the trasaction to go through' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been chosen!' });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Lottery Contract</h1>
        </header>
        <p className="App-intro">
          This contract is managed by {this.state.manager}
        </p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')}{' '}
          ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Try your luck and win some ehter</h4>
          <div>
            <label>Amount of ether to enter the lottery </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <h4>Click the button to pick a winner</h4>
        <button onClick={this.pickAWinner}>Pick a winner!</button>
        <hr />
        <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
