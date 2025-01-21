import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GAME_STATUS, DECK } from '../constants';
import { CardData, DeckCard } from "../types";

interface GameContextProps {
  gameStatus: string;
  playerChips: number;
  betAmount: number;
  playerCards: CardData[];
  dealerCards: CardData[];
  playerScore: number;
  dealerScore: number;
  deck: CardData[];
  setGameStatus: (status: string) => void;
  setPlayerChips: (chips: number) => void;
  setBetAmount: (amount: number) => void;
  setPlayerCards: (cards: CardData[]) => void;
  setDealerCards: (cards: CardData[]) => void;
  setPlayerScore: (score: number) => void;
  setDealerScore: (score: number) => void;
  setDeck: (deck: DeckCard[]) => void
  initializeGame: () => void;
  hit: () => void;
  stand: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [playerChips, setPlayerChips] = useState(100);
  const [betAmount, setBetAmount] = useState(10);
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [dealerCards, setDealerCards] = useState<CardData[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [deck, setDeck] = useState([...DECK]);

  const calculateScore = (cards: CardData[]): number => {
    const sum = cards.reduce((total, card) => total + card.value!, 0);
    const hasAce = cards.some((card) => card.rank === 'ACE');
    return sum > 21 && hasAce ? sum - 10 : sum;
  };

  const generateCard = (): CardData => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    setDeck((prev) => prev.filter((_, i) => i !== randomIndex));
    return card;
  };

  const initializeGame = () => {
    const initialDeck = [...DECK];
    setDeck(initialDeck);
    const playerHand = [generateCard(), generateCard()];
    const dealerHand = [generateCard()];

    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore(dealerHand));
    setGameStatus(GAME_STATUS.PLAYING);
  };

  const hit = () => {
    const newCard = generateCard();
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);

    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setGameStatus(GAME_STATUS.LOSE);
    }
  };

  const stand = async () => {
    setGameStatus(GAME_STATUS.DEALER_TURN);
    const dealerHand = [...dealerCards];
    let score = dealerScore;

    while (score <= 16) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newCard = generateCard();
      dealerHand.push(newCard);
      score = calculateScore(dealerHand);
      setDealerCards(dealerHand);
      setDealerScore(score);
    }

    if (score >= playerScore && score <= 21) {
      setGameStatus(GAME_STATUS.LOSE);
    } else {
      setGameStatus(GAME_STATUS.WIN);
    }
  };

  const resetGame = () => {
    setGameStatus(GAME_STATUS.READY);
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setDeck([...DECK]);
  };

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        playerChips,
        betAmount,
        playerCards,
        dealerCards,
        playerScore,
        dealerScore,
        deck,
        setGameStatus,
        setBetAmount,
        setPlayerChips,
        setPlayerCards,
        setDealerCards,
        setPlayerScore,
        setDealerScore,
        setDeck,
        initializeGame,
        hit,
        stand,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};