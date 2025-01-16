import { DeckCard } from "./types";

export const DECK: DeckCard[] = [];
export const RANKS = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  ACE: 11,
};
export const SUITS = ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"];
SUITS.forEach((suit) => {
    Object.keys(RANKS).forEach((rank) => {
      DECK.push({ rank, suit, value: RANKS[rank as keyof typeof RANKS] });
    });
  });
export const GAME_STATUS = {
    READY: "ready",
    PLAYING: "playing",
    LOSE: "lose",
    DEALER_TURN: "dealer turn",
    WIN: "win",
    NEW_GAME: 'new game',
    TEST: "test"
  };