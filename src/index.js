import React from 'react'
import AudioPlayer from 'react-h5-audio-player'
import {render} from 'react-dom'
import birds from './data/data'
import './index.scss'
import bird_hide_img from './assets/bird_hide.jpg'
import error from './audio/error.mp3'
import correct from './audio/correct.mp3'
import failure from './audio/failure.mp3'
import success from './audio/success.mp3'
function audioPlay(music) {
  let audio = new Audio()
  audio.preload = 'auto'
  audio.src = music
  audio.play()
}

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
birds.forEach(el=>shuffle(el))

class BirdInfo extends React.Component {
  returnBirdInf() {
    let inf = ''
    birds[this.props.page].forEach((el) => {
      if (el.name === this.props.selectedBird) inf = el
    })

    return inf
  }
  render() {
    return this.props.selectedBird ? (
      <div>
        <span className="bird-name">{this.props.selectedBird}.</span>
        <hr/>
        <span>{this.returnBirdInf().species}</span>
        <AudioPlayer
          autoPlay={false}
          customAdditionalControls={[]}
          showJumpControls={false}
          src={this.returnBirdInf().audio}
          autoPlayAfterSrcChange={false}
        />
        <img src={this.returnBirdInf().image} alt="hide bird" />
        <p>{this.returnBirdInf().description}</p>
      </div>
    ) : (
      <p>Послушайте плеер. Выберите птицу из списка</p>
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
          <div className="birds-player-controls">
            <p className='name'>{this.props.birdName}</p>
            <hr/>
            <AudioPlayer
              customAdditionalControls={[]}
              showJumpControls={false}
              src={this.props.birdAudio}
              autoPlayAfterSrcChange={false}
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
        <span className="li-btn"></span><span>{this.props.data.name}</span>
        <hr />
      </li>
    )
  }
}
function ShowMessage({show, score}) {
  let message = ''
  if (score === 30 && show) {
    audioPlay(success)
    message = 'Молодец ты отлично справился ты набрал максимальный бал !'
  } else {
    if (show) audioPlay(failure)
    message = `Ты набрал ${score} из 30, попробуй ещё раз!`
  }
  return show ? (
    <>
      <div className="message">
        <p>{message}</p>
        {}
      </div>
    </>
  ) : (
    <></>
  )
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
      message: false,
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

      if (
        event.target.innerText === this.state.answers[this.state.page].name &&
        !this.state.answer
      ) {
        this.setState((state) => ({
          score: state.score + state.points,
          answer: true,
          birdName: event.target.innerText,
          birdImg: state.answers[state.page].image,
        }))
        console.log(event);
        event.target.previousSibling.classList.add('true')
        audioPlay(correct)
      } else {
        if (!this.state.answer) audioPlay(error)
        this.setState((state) => ({points: state.points - 1}))
        if (!this.state.answer) event.target.previousSibling.classList.add('false')
      }
    }
  }
  gameEnd() {
    this.setState(() => ({message: true}))
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
        <ShowMessage show={this.state.message} score={this.state.score} />
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
