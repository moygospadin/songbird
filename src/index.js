import React from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/src/styles.scss'
import {render} from 'react-dom'
import birds from './data/data'
import './index.scss'
import bird_hide_img from './assets/bird_hide.jpg'
let listItemNames = [
  'Разминка',
  'Воробьиные',
  'Лесные птицы',
  'Певчие птицы',
  'Хищные птицы',
  'Морские птицы',
]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
shuffle(birds)

class BirdInfo extends React.Component {
  returnBirdDescription() {
    let description = ''
    birds[this.props.page].forEach((el) => {
      if (el.name === this.props.selectedBird) description = el.description
    })
    return description
  }
  returnBirdAudio() {
    let audio = ''
    birds[this.props.page].forEach((el) => {
      if (el.name === this.props.selectedBird) audio = el.audio
    })
    return audio
  }
  render() {
    return this.props.selectedBird ? (
      <div>
        <span className="bird-name">{this.props.selectedBird}.</span>
        <AudioPlayer
          autoPlay={false}
          customAdditionalControls={[]}
          showJumpControls={false}
          src={this.returnBirdAudio()}
          onPlay={(e) => console.log('onPlay')}
        />
        <span>{this.returnBirdDescription()}</span>
      </div>
    ) : (
      <span>Послушайте плеер. Выберите птицу из списка</span>
    )
  }
}
class Button extends React.Component {
  render() {
    return this.props.answer ? (
      this.props.page < 5 ? (
        <button className="next-lvl-btn " onClick={this.props.click}>
          Next Level
        </button>
      ) : (
        <button className="next-lvl-btn " onClick={this.props.gameEnd}>
          Game End
        </button>
      )
    ) : (
      <button className="next-lvl-btn not-active">Next Level</button>
    )
  }
}

class GameBoard extends React.Component {
 
  render() {
    return (
      <div className="game-board">
        <div className="birds-player">
          <img src={this.props.birdImg} alt="hide bird" />
          <div>
            <span>{this.props.birdName}</span>
            <AudioPlayer
              customAdditionalControls={[]}
              showJumpControls={false}
              src={this.props.birdAudio}
              onPlay={(e) => console.log('onPlay')}
            />
          </div>
        </div>
      </div>
    )
  }
}
class ListItem extends React.Component {
  createListItem() {
    return listItemNames.map((el, index) => (
      <ListItemName info={this.props.page === index} key={el} name={el} />
    ))
  }

  render() {
    return <ul className="menu">{this.createListItem()}</ul>
  }
}
class ListItemName extends React.Component {
  render() {
    return this.props.info ? (
      <li className="active"> {this.props.name}</li>
    ) : (
      <li> {this.props.name}</li>
    )
  }
}
class BirdsName extends React.Component {
  render() {
    return (
      <li>
        <span>{this.props.data.name}</span>
      </li>
    )
  }
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      page: 0,
      points: 5,
      birdName: '**********',
      selectedBird: false,
      birdImg: bird_hide_img,
      answers: [
        birds[0][Math.floor(1 + Math.random() * 6) - 1],
        birds[1][Math.floor(1 + Math.random() * 6) - 1],
        birds[2][Math.floor(1 + Math.random() * 6) - 1],
        birds[3][Math.floor(1 + Math.random() * 6) - 1],
        birds[4][Math.floor(1 + Math.random() * 6) - 1],
        birds[5][Math.floor(1 + Math.random() * 6) - 1],
      ],
      answer: false,
    }
  }

  createBirdsInfo() {
    console.log(this.state.answers[this.state.page].name)
    return birds[this.state.page].map((el) => (
      <BirdsName key={el.name} data={el} />
    ))
  }
  nextLvlBtnClick() {
    if (this.state.page < 5)
      this.setState((state) => ({
        page: state.page + 1,
        selectedBird: false,
        answer: false,
        points: 5,
        birdName: '**********',
        birdImg: bird_hide_img,
      }))
  }
  liClick(event) {
    event.persist()
    if (event.target.localName === 'span') {
      this.setState({selectedBird: event.target.innerText})
      event.target.classList.add('active')
      if (
        event.target.innerText === this.state.answers[this.state.page].name &&
        !this.state.answer
      )
        this.setState((state) => ({
          score: state.score + state.points,
          answer: true,
          birdName: event.target.innerText,
          birdImg: state.answers[state.page].image,
        }))
      else this.setState((state) => ({points: state.points - 1}))
    }
  }
  gameEnd() {
    alert('daw')
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }
  render() {
    return (
      <>
        <header>
          <div className="top-items">
            <h1>Song Bird</h1>
            <p className="score">Score:{this.state.score}</p>
          </div>
          <ListItem page={this.state.page} />
        </header>
        <GameBoard
          page={this.state.page}
          birdImg={this.state.birdImg}
          birdName={this.state.birdName}
          birdAudio={this.state.answers[this.state.page].audio}
        />
        <div className="bird-info">
          <div className="bird-list" onClick={(event) => this.liClick(event)}>
            {this.createBirdsInfo()}
          </div>
          <div className="bird-selected">
            <BirdInfo
              page={this.state.page}
              selectedBird={this.state.selectedBird}
            />
          </div>
        </div>
        <Button
          gameEnd={() => this.gameEnd()}
          page={this.state.page}
          answer={this.state.answer}
          click={() => this.nextLvlBtnClick()}
        />
      </>
    )
  }
}

render(<App />, document.getElementById('root'))
