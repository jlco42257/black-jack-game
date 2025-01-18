import "./App.css";
import Card from "./components/Card";
import { useState } from "react";
import { CardData, DeckCard } from "./types";
import { DECK, GAME_STATUS, RANKS } from "./constants";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

function App() {
  // State to track the current game status
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);

  // Player and dealer card hands and their respective scores
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<CardData[]>([]);
  const [dealerScore, setDealerScore] = useState(0);

  // Current deck of cards in the game
  const [deckGame, setDeckGame] = useState([...DECK]);

  // Get window size for rendering confetti properly
  const { width, height } = useWindowSize();

  /**
   * Calculates the total score of a given hand.
   * If the score exceeds 21 but the hand contains an Ace, adjusts the Ace value to avoid busting.
   * @param cards - Array of CardData objects representing a hand
   * @returns Total score of the hand
   */
  function calculateScore(cards: CardData[]): number {
    const sum = cards.reduce((total, card) => total + card.value!, 0);
    const hasAce = cards.some((card) => card.rank === "ACE");

    if (sum > 21 && hasAce) {
      return sum - 10; // Adjust the value of one Ace from 11 to 1
    }
    return sum;
  }

  /**
   * Draws a random card from the current deck and removes it.
   * Updates the deck state after removing the card.
   * @param deck - Array of cards representing the current deck
   * @returns A CardData object representing the drawn card
   */
  function generateCard(deck: DeckCard[]) {
    const newDeck = deck;
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    const indexToDelete = newDeck.indexOf(randomCard);

    newDeck.splice(indexToDelete, 1); // Remove the drawn card from the deck
    setDeckGame(newDeck);

    const card: CardData = {
      rank: randomCard.rank,
      suit: randomCard.suit,
      value: RANKS[randomCard.rank as keyof typeof RANKS],
    };
    return card;
  }

  /**
   * Initializes a new game.
   * Resets the deck, deals initial cards to the player and dealer, and updates scores.
   */
  function initGame() {
    const newDeck = Array.from(DECK); // Reset the deck
    setDeckGame(newDeck);

    // Deal initial hands
    const newPlayerHand = [generateCard(newDeck), generateCard(newDeck)];
    const newDealerHand = [generateCard(newDeck)];

    // Start the game
    setPlayerCards(newPlayerHand);
    setDealerCards(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore(newDealerHand));
    setGameStatus(GAME_STATUS.PLAYING);
  }

  /**
   * Handles the "Hit" action for the player.
   * Draws a new card for the player and updates their score.
   * If the player goes over 21, ends the game with a loss.
   */
  function hitCard() {
    const newDeck = deckGame;
    const newHand = [...playerCards, generateCard(newDeck)];
    const newScore = calculateScore(newHand);

    setPlayerCards(newHand);
    setPlayerScore(newScore);
    if (newScore > 21) setGameStatus(GAME_STATUS.LOSE); // Player loses if score > 21
  }

  /**
   * Creates a delay for a specified number of milliseconds.
   * Useful for adding pauses during the dealer's turn.
   * @param ms - Duration of the delay in milliseconds
   * @returns A promise that resolves after the specified delay
   */
  const pause = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Handles the "Stand" action for the player.
   * Starts the dealer's turn, where the dealer draws cards until their score exceeds 16.
   * Ends the game based on the dealer's and player's scores.
   */
  async function stand() {
    setGameStatus(GAME_STATUS.DEALER_TURN);
    let currentScore = dealerScore;
    let currentHand = dealerCards;

    // Dealer draws cards until their score exceeds 16
    while (currentScore <= 16) {
      const newDeck = deckGame;
      await pause(1500); // Add delay for better user experience
      currentHand = [...currentHand, generateCard(newDeck)];
      setDealerCards(currentHand);
      currentScore = calculateScore(currentHand);
      setDealerScore(currentScore);
    }

    // Determine the game outcome
    await pause(1500);
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
