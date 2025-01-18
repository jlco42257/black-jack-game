import "./App.css";
import Card from "./components/Card";
import { useState } from "react";
import { CardData, DeckCard } from "./types";
import { DECK, GAME_STATUS, RANKS } from "./constants";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

function App() {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<CardData[]>([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [deckGame, setDeckGame] = useState([...DECK]);
  const { width, height } = useWindowSize();

  function calculateScore(cards: CardData[]): number {
    const sum = cards.reduce((total, card) => total + card.value!, 0);
    const hasAce = cards.some((card) => card.rank === "ACE");

    if (sum > 21 && hasAce) {
      return sum - 10;
    }
    return sum;
  }

  function generateCard(deck: DeckCard[]) {
    const newDeck = deck;
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    const indexToDelete = newDeck.indexOf(randomCard);

    newDeck.splice(indexToDelete, 1);
    setDeckGame(newDeck);

    const card: CardData = {
      rank: randomCard.rank,
      suit: randomCard.suit,
      value: RANKS[randomCard.rank as keyof typeof RANKS],
    };
    return card;
  }

  // Función para crear la pausa
  const pause = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

   function initGame() {
    const newDeck = Array.from(DECK);
    setDeckGame(newDeck);
    const newPlayerHand = [generateCard(newDeck), generateCard(newDeck)];
    const newDealerHand = [generateCard(newDeck)];

    setPlayerCards(newPlayerHand);
    setDealerCards(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore(newDealerHand));
    setGameStatus(GAME_STATUS.PLAYING);
  }
  function hitCard() {
    const newDeck = deckGame
    const newHand = [...playerCards, generateCard(newDeck)];
    const newScore = calculateScore(newHand);

    setPlayerCards(newHand);
    setPlayerScore(newScore);
    if (newScore > 21) setGameStatus(GAME_STATUS.LOSE);
  }

  async function stand() {
    setGameStatus(GAME_STATUS.DEALER_TURN);
    let currentScore = dealerScore;
    let currentHand = dealerCards;

    while (currentScore <= 16) {
      const newDeck = deckGame
      await pause(1500);
      currentHand = [...currentHand, generateCard(newDeck)];
      setDealerCards(currentHand);
      currentScore = calculateScore(currentHand);
      setDealerScore(currentScore);
    }

    await pause(1500)
    if (currentScore >= playerScore && currentScore < 22) {
      setGameStatus(GAME_STATUS.LOSE);
    } else {
      setGameStatus(GAME_STATUS.WIN);
    }
  }
  return (
    <main className="game__container">
      <h1 className="brand">Black Jack Game</h1>
      {gameStatus == GAME_STATUS.READY && (
        <button onClick={initGame} className="play-button">
          play
        </button>
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
          <button onClick={hitCard}>Hit</button>
          <button onClick={stand}>Stand</button>
        </div>
      )}
      {gameStatus == GAME_STATUS.LOSE && (
        <div className="game-finish__container">
          <h2>You Lose!</h2>
          <button onClick={initGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
      {gameStatus == GAME_STATUS.WIN && (
        <div className="game-finish__container">
          <h2>You Win!</h2>
          <button onClick={initGame} className="new-game__button">
            new game
          </button>
          <Confetti width={width - 15} height={height - 15} />
        </div>
      )}
    </main>
  );
}

export default App;
