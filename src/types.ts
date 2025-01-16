export type DeckCard = {
  rank: string,
  suit: string,
  value: number
}
export type CardData = {
  rank?: string,
  suit?: string
  value?: number,
}
export type CardProps = {
  props: {rank: string, suit: string},
}