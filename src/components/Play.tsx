import { useState } from 'react';
import '../styles/play.css'
import { useGame } from '../context/GameContext';

const Play = () => {
  const {playerChips, setPlayerChips, betAmount, setBetAmount, initializeGame} = useGame();
  const [error, setError] = useState<string | null>(null);

  function onGameStart(playerChips: number, betAmount: number) {
    setPlayerChips(playerChips);
    setBetAmount(betAmount);
    initializeGame()
  }

  const handleStartGame = () => {
    if (betAmount > playerChips) {
      setError('Your bet cannot exceed your total chips.');
      return;
    }
    if (betAmount <= 0) {
      setError('Bet amount must be greater than 0.');
      return;
    }
    setError(null); // Limpiar errores previos
    onGameStart(playerChips, betAmount); // Pasar datos al componente principal
  };

  return (
    <div className="play__container">
      <p>Set your chips and place your bet to start playing.</p>

      <div className="form-group">
        <label htmlFor="player-chips" className='input__label'>Total Chips:</label>
        <input
          id="player-chips"
          type="number"
          className='input__field'
          min={1}
          value={playerChips}
          onChange={(e) => setPlayerChips(Number(e.target.value))}
          onBlur={(e) => setPlayerChips(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bet-amount" className='input__label'>Bet Amount:</label>
        <input
          id="bet-amount"
          type="number"
          className='input__field'
          min={1}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          onBlur={(e) => setBetAmount(Number(e.target.value))}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="start-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default Play;