import "./App.css";
import Card from "./components/Card";
import { useState } from "react";
import { CardData } from "./types";
import { DECK, GAME_STATUS, RANKS } from "./constants";

function App() {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<CardData[]>([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [deckGame, setDeckGame] = useState(DECK);

  function calculateScore(cards: CardData[]): number {
    const sum = cards.reduce((total, card) => total + card.value!, 0);
    const hasAce = cards.some((card) => card.rank === "ACE");

    if (sum > 21 && hasAce) {
      return sum - 10;
    }
    return sum;
  }

  function generateCard() {
    const newDeck = deckGame;
    const randomCard = deckGame[Math.floor(Math.random() * deckGame.length)];
    const indexToDelete = newDeck.indexOf(randomCard);

    newDeck.splice(indexToDelete, 1);
    setDeckGame(newDeck);

    const card: CardData = {
      rank: randomCard.rank,
      suit: randomCard.suit,
      value: RANKS[randomCard.rank as keyof typeof RANKS],
    };
    return card;
  };

  function initGame(){
    setDeckGame(DECK);
    const newPlayerHand = [generateCard(),generateCard()]
    const newDealerHand = [generateCard()]

    setPlayerCards(newPlayerHand)
    setDealerCards(newDealerHand)
    setPlayerScore(calculateScore(newPlayerHand))
    setDealerScore(calculateScore(newDealerHand))
    setGameStatus(GAME_STATUS.PLAYING)
  };
  function hitCard() {
    const newHand = [...playerCards, generateCard()]
    const newScore = calculateScore(newHand)

    setPlayerCards(newHand)
    setPlayerScore(newScore)
    if(newScore > 21) setGameStatus(GAME_STATUS.LOSE)
  }

  function stand() {
    setGameStatus(GAME_STATUS.DEALER_TURN);
    let currentScore = dealerScore
    let currentHand = dealerCards

    while (currentScore <= 16) {
      currentHand = [...currentHand, generateCard()]
      setDealerCards(currentHand)
      currentScore = calculateScore(currentHand)
      setDealerScore(currentScore)
    }

    if (currentScore >= playerScore && currentScore < 22) {
      setGameStatus(GAME_STATUS.LOSE)
    }else{
      setGameStatus(GAME_STATUS.WIN)
    }
  }
  return (
    <>
      <h1>Black Jack Game</h1>
      {gameStatus == GAME_STATUS.READY && (
        <button onClick={initGame} className="play-button">
          play
        </button>
      )}
      {gameStatus != GAME_STATUS.READY && <h2>Dealer Hand</h2>}
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
        <div className="score">
          <p> Dealer score:{dealerScore}</p>
        </div>
      )}
      {gameStatus != GAME_STATUS.READY && <h2>Your Hand</h2>}
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
        <div className="score">
          <p>score:{playerScore}</p>
        </div>
      )}
      {gameStatus == GAME_STATUS.PLAYING && (
        <div className="actions__container">
          <button onClick={hitCard}>Hit</button>
          <button onClick={stand}>Stand</button>
        </div>
      )}
      {gameStatus == GAME_STATUS.LOSE && (
        <div className="game-over__container">
          <h2>You Lose!</h2>
          <button onClick={initGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
      {gameStatus == GAME_STATUS.WIN && (
        <div className="game-over__container">
          <h2>You Win!</h2>
          <button onClick={initGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
    </>
  );
}

export default App;
