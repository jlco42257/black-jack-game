import "./App.css";
import Card from "./components/Card";
import { useCallback, useEffect, useState } from "react";
import { CardData, DeckCard } from "./types";
import { DECK, GAME_STATUS, RANKS } from "./constants";

const sumCards = (cards: CardData[]) => {
  return cards.reduce((acc, card) => acc + (card.value as number), 0);
};

function App() {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<CardData[]>([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [deckGame, setDeckGame] = useState(DECK);

  const handleScore = useCallback(
    (
      userHand: CardData[],
      setUserHand: (value: React.SetStateAction<CardData[]>) => void,
      setUserScore: (value: React.SetStateAction<number>) => void
    ) => {
      let sum = sumCards(userHand);
      const newhand = userHand;
      const ace = newhand.find((card) => card.rank == "ACE");
      const aceValue = ace?.value as number;
      if (sum > 21 && ace && aceValue == 11) {
        ace.value = 1;
        setUserHand(newhand);
        sum = sumCards(userHand);
      }
      setUserScore(sum);
    },
    []
  );

  const generateCard = useCallback(
    (
      deck: DeckCard[],
      userHand: CardData[],
      setUserHand: (value: React.SetStateAction<CardData[]>) => void
    ) => {
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
      setUserHand([...userHand, card]);
      return card;
    },
    []
  );
  const initGame = ()=>{
    if (gameStatus == GAME_STATUS.NEW_GAME) {
      setTimeout(() => setGameStatus(GAME_STATUS.READY), 300);
      setPlayerCards([]);
      setDealerCards([]);
    }
    if (gameStatus == GAME_STATUS.READY) {
      setDeckGame([]);
      generateCard(deckGame, playerCards, setPlayerCards);
      generateCard(deckGame, dealerCards, setDealerCards);
    }
  };
  useEffect(()=>initGame)
  
  useEffect(() => {
    handleScore(dealerCards, setDealerCards, setDealerScore);
    if (dealerScore > 21) {
      setGameStatus(GAME_STATUS.WIN);
    }
  }, [dealerCards, dealerScore, handleScore]);
  function handleplay() {
    setGameStatus(GAME_STATUS.PLAYING);
  }
  function hitCard() {
    generateCard(deckGame, playerCards, setPlayerCards);
    if (playerScore > 21) {
      setGameStatus(GAME_STATUS.LOSE);
    }
  }
  const verifyPlayer = useCallback(()=>{
    handleScore(playerCards, setPlayerCards, setPlayerScore);
    if (playerScore > 21) {
      setGameStatus(GAME_STATUS.LOSE);
    }
  }, [handleScore, playerCards, playerScore])
  useEffect(() => verifyPlayer(), [verifyPlayer]);

  const test = () => {
    setPlayerCards([]);
    setGameStatus(GAME_STATUS.PLAYING);
    const card1: CardData = {
      rank: "ACE",
      suit: "SPADES",
      value: 11,
    };
    const card2: CardData = {
      rank: "10",
      suit: "SPADES",
      value: 10,
    };
    const card3: CardData = {
      rank: "ACE",
      suit: "SPADES",
      value: 11,
    };
    setPlayerCards([card1, card2, card3]);
  };
  function dealerTurn() {
    let score = dealerScore;

    while (score < playerScore && score <= 21) {
      const card = generateCard(deckGame, dealerCards, setDealerCards);
      let newValue = card.value;
      if (newValue == 1 && score + newValue > 11) newValue = 1;
      score += newValue as number;
      handleScore(dealerCards, setDealerCards, setDealerScore);
      console.log("ciclo");
      if (dealerScore > 21) {
        setGameStatus(GAME_STATUS.WIN);
      }
      if (dealerScore < 21 && dealerScore > playerScore) {
        setGameStatus(GAME_STATUS.LOSE);
      }
    }

    if (dealerScore > 21) {
      setGameStatus(GAME_STATUS.WIN);
    } else if (dealerScore >= playerScore) {
      setGameStatus(GAME_STATUS.LOSE);
    }
  }
  function stand() {
    setGameStatus(GAME_STATUS.DEALER_TURN);
    handleScore(dealerCards, setDealerCards, setDealerScore);
    dealerTurn();
  }
  function newGame() {
    setGameStatus(GAME_STATUS.NEW_GAME);
    setPlayerCards([]);
    setDealerCards([]);
    setDeckGame(DECK);
  }
  return (
    <>
      <h1>Black Jack Game</h1>
      {gameStatus == GAME_STATUS.TEST && <button onClick={test}>test</button>}
      {gameStatus == GAME_STATUS.READY && (
        <button onClick={handleplay} className="play-button">
          play
        </button>
      )}
      {gameStatus != GAME_STATUS.READY && <h2>Dealer Hand</h2>}
      <div className="player-cards__container">
        {gameStatus == GAME_STATUS.PLAYING &&
          dealerCards.map((card, index) => (
            <Card
              key={index}
              props={{ rank: "BACKSIDE" as string, suit: card.suit as string }}
            />
          ))}
        {gameStatus != GAME_STATUS.READY &&
          gameStatus != GAME_STATUS.PLAYING &&
          dealerCards.map((card, index) => (
            <Card
              key={index}
              props={{ rank: card.rank as string, suit: card.suit as string }}
            />
          ))}
      </div>
      {gameStatus != GAME_STATUS.PLAYING && gameStatus != GAME_STATUS.READY && (
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
          <button onClick={newGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
      {gameStatus == GAME_STATUS.WIN && (
        <div className="game-over__container">
          <h2>You Win!</h2>
          <button onClick={newGame} className="new-game__button">
            new game
          </button>
        </div>
      )}
    </>
  );
}

export default App;
