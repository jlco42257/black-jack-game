import "./App.css";
import Card from "./components/Card";
import { GAME_STATUS } from "./constants";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Play from "./components/Play";
import { useGame } from "./context/GameContext";
import Insurance from "./components/Insurance";

function App() {
  // State to track the current game status
  const {gameStatus, playerCards, playerScore, dealerCards, dealerScore, playerChips, hit, stand, resetGame, betAmount} = useGame();

  

  // Get window size for rendering confetti properly
  const { width, height } = useWindowSize();
  
  return (
    <main className="game__container">
      <h1 className="brand">Black Jack Game</h1>
      {gameStatus == GAME_STATUS.READY && (
        <>
          <Play/>
        </>
      )}
      {gameStatus != GAME_STATUS.READY && (
        <span>
          <p>your chips: {playerChips}</p>
          <p>bet amount: {betAmount}</p>
        </span>
      )}
      <div className="player-cards__container">
        {gameStatus != GAME_STATUS.READY &&
          dealerCards.map((card, index) => (
            <Card
              key={index}
              props={{ rank: card.rank as string, suit: card.suit as string }}
            />
          ))}
      </div>
      {gameStatus != GAME_STATUS.READY && (
        <>
          <p className="score">score:{dealerScore}</p>
        </>
      )}
      <div className="player-cards__container">
        {gameStatus != GAME_STATUS.READY &&
          playerCards.map((card, index) => (
            <Card
              key={index}
              props={{ rank: card.rank as string, suit: card.suit as string }}
            />
          ))}
      </div>
      {gameStatus != GAME_STATUS.READY && (
        <p className="score">score:{playerScore}</p>
      )}
      {gameStatus == GAME_STATUS.PLAYING && (
        <div className="actions__container">
          <button onClick={hit}>Hit</button>
          <button onClick={stand}>Stand</button>
        </div>
      )}
      <Insurance/>
      {gameStatus == GAME_STATUS.LOSE && (
        <div className="game-finish__container">
          <h2>You Lose!</h2>
          <button onClick={resetGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
      {gameStatus == GAME_STATUS.WIN && (
        <div className="game-finish__container">
          <h2>You Win!</h2>
          <button onClick={resetGame} className="new-game__button">
            new game
          </button>
          <Confetti width={width - 15} height={height - 15} />
        </div>
      )}
    </main>
  );
}

export default App;
