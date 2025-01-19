import "../styles/card.css";
import { CardProps } from "../types";

// Determines if the application is running in development mode.
// This checks the Vite-specific `import.meta.env.MODE` variable, which 
// holds the current environment mode ('development' or 'production').
// Returns `true` if the mode is 'development', otherwise `false`. 
const isDev = import.meta.env.MODE === 'development'

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

  // Construct the path to the card image based on its rank, suit and the current environment mode
  const pathImage = isDev ? `black-jack-game/cards/${rank}-${suit}.jpg` : `cards/${rank}-${suit}.jpg`;
  const altText = `${rank} of ${suit}`

  return (
    <div className="card">
      <img src={pathImage.toLowerCase()} alt={altText.toLowerCase()}/>
    </div>
  );
}
export default Card;
