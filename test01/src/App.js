import React, { Fragment } from 'react';
import "./App.css";


class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    this.props.onClick(this.props.num);
  }
  render() {
    let clicked = this.props.squares[this.props.num] ? true : false;
    return (
      <button className="square" onClick={this.onClick} disabled={this.props.winner || clicked}>
        {this.props.squares[this.props.num]}
      </button>
    )
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      history: [],
    };
  }

  handleReset() {
    this.setState({
      squares: Array(9).fill(null),
      winner: null,
      history: [],
      xIsNext: true,
    })
  }
  cheakWin(squares) {
    let winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    let result = winPatterns.map((pattern) => {
      if (squares[pattern[0]] === squares[pattern[1]] && squares[pattern[1]] === squares[pattern[2]] && squares[pattern[0]] !== null) {
        return squares[pattern[0]];
      } else {
        return null;
      }
    })

    let winner =  result.filter((item) => item !== null)[0];
    console.log(winner);
    if (winner) {
      this.setState({ winner: winner });
    } else {
      this.setState({ winner: null })
    }
  }

  handleClick(i) {
    let tmpsquares = this.state.squares.slice();
    tmpsquares[i] = this.state.xIsNext ? 'X' : 'O';
    // switch turn
    this.setState({ xIsNext: !this.state.xIsNext });
    this.setState({ squares: tmpsquares });

    // push history
    this.pushHistory(tmpsquares);
    // check win
    this.cheakWin(tmpsquares);

  }

  pushHistory(square) {
    let history = this.state.history.slice();
    history.push(square);
    this.setState({ history: history });
  }

  rendSquare(i) {
    return <Square num={i} onClick={() => this.handleClick(i)} squares={this.state.squares} winner={this.state.winner}></Square>
  }

  render() {
    return (
      <Fragment>
        <button className="reset" onClick={() => this.handleReset()}>Reset</button>

        <div className="board-row">
          now is the turn of <b>{this.state.xIsNext ? "X" : "O"}</b>
        </div>
        <div className="board-row">
          {this.state.winner ? <div>Game ended, Winner is <b>{this.state.winner}</b></div> : <br></br>}
        </div>
        <div className="board-row">
          <ul>
            {this.state.history.map((square, i) => {
              return <li key={i}>
                <button className="history" onClick={() => {this.setState({ squares: square });this.cheakWin(square);}}>Back to {i}</button>
              </li>
            })}
          </ul>
        </div>
        <table >
          <tbody>
            <tr className='square'>
              {this.rendSquare(0)}
              {this.rendSquare(1)}
              {this.rendSquare(2)}
            </tr>
            <tr className='square'>
              {this.rendSquare(3)}
              {this.rendSquare(4)}
              {this.rendSquare(5)}
            </tr>
            <tr className='square'>
              {this.rendSquare(6)}
              {this.rendSquare(7)}
              {this.rendSquare(8)}
            </tr>
          </tbody>
        </table>
      </Fragment>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br></br>
        <Board></Board>

      </header>
    </div>
  );
}

export default App;
