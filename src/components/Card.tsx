import "../styles/card.css";
import { CardProps } from "../types";

/**
 * Renders a playing card based on the provided rank and suit.
 * The card image is dynamically loaded from the public folder using the rank and suit.
 *
 * @param props - The properties containing the card details (rank and suit).
 * @returns A JSX element displaying the card.
 */
function Card(props: CardProps) {
  // Destructure the rank and suit properties from the provided props
  const { rank, suit } = props.props;

  // Construct the path to the card image based on its rank and suit
  const pathImage = `../../public/cards/${rank}-${suit}.jpg`;

  return (
    <div className="card">
      <img src={pathImage.toLowerCase()} alt="" />
    </div>
  );
}
export default Card;
