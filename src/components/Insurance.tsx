import { useGame } from '../context/GameContext';

const Insurance = () => {
  const { canTakeInsurance, takeInsurance, insuranceBet } = useGame();

  if (!canTakeInsurance) return null;

  return (
    <div className="insurance-container">
      <p>Dealer's visible card is an Ace. Would you like to take insurance?</p>
      <button onClick={takeInsurance} disabled={insuranceBet > 0}>
        Take Insurance
      </button>
      {insuranceBet > 0 && <p>Insurance bet placed: {insuranceBet}</p>}
    </div>
  );
};

export default Insurance;
