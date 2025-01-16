import '../styles/card.css'
import { CardProps } from '../types'
function Card(props: CardProps) {
  const {rank, suit} = props.props
  const pathImage = rank != 'BACKSIDE' ? `../../public/cards/${rank}-${suit}.jpg` : `../../public/cards/${rank}.jpg`
  return (
    <div className="card">
      <img src={pathImage.toLowerCase()} alt="" />
    </div>
  );
}
export default Card;
