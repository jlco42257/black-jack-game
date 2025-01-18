# Blackjack Game 🎴

A simple and interactive **Blackjack game** built with React and TypeScript. The project demonstrates core concepts of state management, React components, and game logic.

---

## 🚀 Features

- Play against the dealer in a classic Blackjack game.
- Dealer automatically follows the rules to draw cards.
- Interactive UI with animations (e.g., card drawing delay).
- Tracks player and dealer scores in real-time.
- Victory confetti when the player wins. 🎉

---

## 🔧 Tech Stack

- **React**: For building the UI.
- **TypeScript**: For static typing and improved code maintainability.
- **CSS**: For styling components.

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jlco42257/black-jack-game.git
   cd blackjack-game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🎮 How to Play

1. Click **"Play"** to start the game.
2. Your hand is dealt two cards, and the dealer gets one visible card.
3. Choose between:
   - **Hit**: Draw another card.
   - **Stand**: End your turn, and the dealer will play.
4. The game ends when:
   - Your score exceeds 21 (**Bust**).
   - The dealer's turn is over, and scores are compared.
5. **Winning Condition**:
   - Your score is higher than the dealer's, but does not exceed 21.
   - The dealer's score exceeds 21.

---

## 🖍️ Code Highlights

### `App.tsx` – Core Game Logic

- **Game Initialization**: Resets the deck, player hands, and scores.
- **Score Calculation**: Adjusts for Aces to avoid busting.
- **Dealer Turn**: Dealer draws cards with a delay until a score threshold is met.

### `Card.tsx` – Reusable Card Component

Displays a playing card image based on rank and suit.

---

## 🙌 Contributions

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 🔖 License

This project is licensed under the [MIT License](LICENSE).