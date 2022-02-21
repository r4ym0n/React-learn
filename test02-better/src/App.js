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
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,

    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
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
    console.log(result)
    let winner = result.filter((item) => item !== null);
    if (winner.length > 0) {
      return winner
    } else {
      return null;
    }
  }

  handleClick(i) {
    // 尽可能精简状态，如果一个状态是另一个状态可计算的，可以放在一起
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.cheakWin(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,

    });

    // let tmpsquares = this.state.squares.slice();
    // tmpsquares[i] = this.state.xIsNext ? 'X' : 'O';
    // // switch turn
    // this.setState({ xIsNext: !this.state.xIsNext });
    // this.setState({ squares: tmpsquares });

    // // push history
    // this.pushHistory(tmpsquares);
    // // check win
    let winner = this.cheakWin(current.squares);
    // winner 逻辑拆分，提升可读性
    if (winner) {
      this.setState({ winner: winner });
    } else {
      this.setState({ winner: null })
    }

  }

  // pushHistory(square) {
  //   let history = this.state.history.slice();
  //   history.push(square);
  //   this.setState({ history: history });
  // }

  rendSquare(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    return <Square num={i} onClick={() => this.handleClick(i)} squares={current.squares} winner={this.state.winner}></Square>
  }

  render() {
    // 这里来进行胜利检测，比放在Click里面更好
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.cheakWin(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)} key={step}>{desc}</button>
        </li>
      );
    });

    return (
      <Fragment>
        <div className='game'>

        <div className="game-board">
            <div className="board-row">
              {this.rendSquare(0)}
              {this.rendSquare(1)}
              {this.rendSquare(2)}
            </div>
            <div className="board-row">
              {this.rendSquare(3)}
              {this.rendSquare(4)}
              {this.rendSquare(5)}
            </div>
            <div className="board-row">
              {this.rendSquare(6)}
              {this.rendSquare(7)}
              {this.rendSquare(8)}
            </div>
          </div>
          
          <div className="game-info">
            <button className="reset" onClick={() => this.handleReset()}>Reset</button>
            now is the turn of <b>{this.state.xIsNext ? "X" : "O"}</b>
            {winner ? <div>Game ended, Winner is <b>{winner}</b></div> : <br></br>}
            <ol>
              {/* 这里可以把对象计算的位置上移 */}
              {moves}
            </ol>
          </div>
          
        </div>
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
