import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

// Hosted images
const chickenImg = "https://i.postimg.cc/3x3Q6pXx/chicken.png";
const crocImg = "https://i.postimg.cc/yNrrK2Zr/crocodile.png";

// Hosted sounds
const bgMusicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const leapSoundUrl = "https://www.soundjay.com/buttons/sounds/button-3.mp3";
const winSoundUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";

export default function App() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [chickenX, setChickenX] = useState(50);
  const [chickenY, setChickenY] = useState(350);
  const [stones, setStones] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const bgAudioRef = useRef(null);
  const leapAudioRef = useRef(null);
  const winAudioRef = useRef(null);

  // Setup stones
  useEffect(() => {
    let generatedStones = [];
    for (let i = 0; i < 6; i++) {
      generatedStones.push({
        id: i,
        x: 100 + i * 100,
        y: 350 + (i % 2 === 0 ? -40 : 40),
        direction: i % 2 === 0 ? 1 : -1,
      });
    }
    setStones(generatedStones);
  }, []);

  // Animate stones
  useEffect(() => {
    if (!started || gameOver || win) return;
    const interval = setInterval(() => {
      setStones((stones) =>
        stones.map((s) => {
          let newY = s.y + s.direction * 2;
          if (newY > 400 || newY < 300) s.direction *= -1;
          return { ...s, y: newY };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [started, gameOver, win]);

  // Countdown before game starts
  useEffect(() => {
    if (started) return;
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setStarted(true);
      if (bgAudioRef.current) bgAudioRef.current.play();
    }
    return () => clearTimeout(timer);
  }, [countdown, started]);

  // Chicken jump
  const handleJump = () => {
    if (gameOver || win) return;
    if (leapAudioRef.current) leapAudioRef.current.play();

    setChickenX((prevX) => prevX + 100);
    const nextStone = stones.find(
      (s) => s.x === chickenX + 100 && Math.abs(s.y - chickenY) < 50
    );

    if (!nextStone) {
      setGameOver(true);
      return;
    }
    setChickenY(nextStone.y);
    if (chickenX + 100 > 600) {
      setWin(true);
      if (winAudioRef.current) winAudioRef.current.play();
    }
  };

  const resetGame = () => {
    setChickenX(50);
    setChickenY(350);
    setCountdown(3);
    setGameOver(false);
    setWin(false);
    setStarted(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom, #87ceeb, #228B22)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <audio ref={bgAudioRef} src={bgMusicUrl} loop />
      <audio ref={leapAudioRef} src={leapSoundUrl} />
      <audio ref={winAudioRef} src={winSoundUrl} />

      {!started && countdown > 0 && (
        <h1 style={{ fontSize: "3rem", color: "white" }}>
          {countdown === 3
            ? "🐣 The egg is cracking..."
            : countdown === 2
            ? "Ready..."
            : "Steady..."}
        </h1>
      )}

      {!started && countdown === 0 && (
        <h1 style={{ fontSize: "3rem", color: "white" }}>Go! 🚀</h1>
      )}

      {started && !gameOver && !win && (
        <div
          style={{
            position: "relative",
            width: "700px",
            height: "500px",
            background: "blue",
            borderRadius: "10px",
          }}
        >
          {/* Chicken */}
          <img
            src={chickenImg}
            alt="chicken"
            style={{
              position: "absolute",
              width: "60px",
              left: chickenX,
              top: chickenY,
              transition: "all 0.3s",
            }}
          />

          {/* Stones */}
          {stones.map((s) => (
            <div
              key={s.id}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                width: "80px",
                height: "30px",
                background: "gray",
                borderRadius: "50%",
              }}
            />
          ))}

          {/* Crocodiles */}
          <img
            src={crocImg}
            alt="croc"
            style={{
              position: "absolute",
              left: 250,
              top: 380,
              width: "80px",
            }}
          />
          <img
            src={crocImg}
            alt="croc"
            style={{
              position: "absolute",
              left: 450,
              top: 320,
              width: "80px",
            }}
          />
        </div>
      )}

      {/* Button */}
      {started && !gameOver && !win && (
        <button
          onClick={handleJump}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1.5rem",
            borderRadius: "10px",
          }}
        >
          Jump 🐓
        </button>
      )}

      {/* Game Over */}
      {gameOver && (
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>💀 Oh no! The chicken fell in the water!</h2>
          <button onClick={resetGame}>Reset</button>
        </div>
      )}

      {/* Win */}
      {win && (
        <div style={{ textAlign: "center", color: "white" }}>
          <Confetti />
          <h2>🎉 Winner gets Chicken Dinner 🤤🤤🤤</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "1rem",
          color: "white",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        Tap <b>Jump</b> when the next stone aligns. Don’t fall into water 🐊.
        Survive till the end to win 🎉.
      </div>
    </div>
  );
}
