import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

// Asset URLs
const chickenImg = "https://i.ibb.co/0F7YBvS/chicken.png";
const crocImg = "https://i.ibb.co/K7Yh4vC/crocodile.png";
const bgMusicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const jumpMusicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
const winMusicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [chickenPos, setChickenPos] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const chickenRef = useRef();
  const crocs = Array(5).fill(0).map((_, i) => ({ id: i, pos: i * 80 + 100 }));

  const bgAudio = useRef(null);
  const jumpAudio = useRef(null);
  const winAudio = useRef(null);

  useEffect(() => {
    bgAudio.current = new Audio(bgMusicUrl);
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0.2;

    jumpAudio.current = new Audio(jumpMusicUrl);
    winAudio.current = new Audio(winMusicUrl);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    bgAudio.current.play();
    setMessage("Get ready! Chicken is cracking out of the egg...");
    setTimeout(() => {
      setMessage("Ready... Steady... Go!");
    }, 3000);
  };

  const jumpChicken = () => {
    if (gameOver) return;
    jumpAudio.current.play();
    setChickenPos((prev) => {
      const next = prev + 50;
      // simple collision check
      if (crocs.some(c => c.pos === next)) {
        setGameOver(true);
        bgAudio.current.pause();
        setMessage("Oh no! Crocodile got the chicken 🐊");
        return prev;
      }
      if (next >= 500) {
        // Win
        setGameOver(true);
        setConfetti(true);
        bgAudio.current.pause();
        winAudio.current.play();
        setMessage("Winner gets Chicken dinner 🤤🎉");
        return prev;
      }
      if (next > 300) setMessage("You're now getting dangerously close!");
      return next;
    });
  };

  const resetGame = () => {
    setChickenPos(0);
    setGameOver(false);
    setConfetti(false);
    setMessage("");
    bgAudio.current.play();
  };

  return (
    <div className="game-container">
      {confetti && <Confetti />}
      {!gameStarted ? (
        <div className="instructions">
          <h2>Chicken vs Crocodiles 🐓🐊</h2>
          <p>Tap the button to start the adventure!</p>
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <>
          <img
            ref={chickenRef}
            src={chickenImg}
            alt="chicken"
            style={{
              position: "absolute",
              bottom: chickenPos + "px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
            }}
          />
          {crocs.map(c => (
            <img
              key={c.id}
              src={crocImg}
              alt="croc"
              style={{
                position: "absolute",
                bottom: c.pos + "px",
                left: Math.random() * 400 + "px",
                width: "80px",
              }}
            />
          ))}
          <div className="instructions">
            <p>{message || "Tap the button to leap over crocodiles!"}</p>
            {!gameOver && <button onClick={jumpChicken}>Leap 🐓</button>}
            {gameOver && <button onClick={resetGame}>Reset</button>}
          </div>
        </>
      )}
    </div>
  );
}
