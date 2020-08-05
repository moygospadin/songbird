import React from 'react'
import {render} from 'react-dom'
import birds from './data/data'
import './index.scss'

class Button extends React.Component {
  render() {
    return (
      <button className="next-lvl-btn" onClick={this.props.click}>
        Next Level
      </button>
    )
  }
}
class BirdsInfo extends React.Component {
  render() {
    return (
      <li>
        <span>{this.props.data.name}</span>
      </li>
    )
  }
}
class GameBoard extends React.Component {
  createBirdsInfo() {
    return birds[this.props.page].map((el) => (
      <BirdsInfo key={el.name} data={el} />
    ))
  }
  render() {
    return <div className="game-board">{this.createBirdsInfo()}</div>
  }
}
class ListItem extends React.Component {
  render() {
    return (
      <ul className="menu">
        <li className="active">Разминка</li>
        <li>Воробьиные</li>
        <li>Лесные птицы</li>
        <li>Певчие птицы</li>
        <li>Хищные птицы</li>
        <li>Морские птицы</li>
      </ul>
    )
  }
}

class App extends React.Component {
  state = {
    score: 0,
    page: 0,
  }
  nextLvlBtnClick() {
    if (this.state.page < 5) this.setState((state) => ({page: state.page + 1}))
  }
  render() {
    return (
      <>
        <header>
          <div className="top-items">
            <h1>Song Bird</h1>
            <p className="score">Score:{this.state.score}</p>
          </div>
          <ListItem />
        </header>
        <GameBoard page={this.state.page} />
        <Button click={() => this.nextLvlBtnClick()} />
      </>
    )
  }
}

render(<App />, document.getElementById('root'))
