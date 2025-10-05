import React, { useState, useEffect, useRef } from 'react';

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameLoop = useRef(null);
  const pipeTimer = useRef(null);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const BIRD_SIZE = 30;
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;

  const jump = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setBirdY(250);
      setBirdVelocity(JUMP_STRENGTH);
      setPipes([]);
      setScore(0);
    } else if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
    } else {
      setGameStarted(true);
      setGameOver(false);
      setBirdY(250);
      setBirdVelocity(JUMP_STRENGTH);
      setPipes([]);
      setScore(0);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      pipeTimer.current = setInterval(() => {
        const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
        setPipes(prev => [...prev, { x: GAME_WIDTH, gapY, passed: false }]);
      }, 2000);

      return () => clearInterval(pipeTimer.current);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(() => {
        setBirdVelocity(v => v + GRAVITY);
        setBirdY(y => {
          const newY = y + birdVelocity;
          if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
            setGameOver(true);
            clearInterval(gameLoop.current);
            clearInterval(pipeTimer.current);
            return y;
          }
          return newY;
        });

        setPipes(prev => {
          const updated = prev
            .map(pipe => ({ ...pipe, x: pipe.x - 3 }))
            .filter(pipe => pipe.x > -PIPE_WIDTH);

          updated.forEach(pipe => {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
              pipe.passed = true;
              setScore(s => s + 1);
            }

            const birdLeft = 100;
            const birdRight = 100 + BIRD_SIZE;
            const birdTop = birdY;
            const birdBottom = birdY + BIRD_SIZE;
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
              if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
                setGameOver(true);
                clearInterval(gameLoop.current);
                clearInterval(pipeTimer.current);
              }
            }
          });

          return updated;
        });
      }, 20);

      return () => clearInterval(gameLoop.current);
    }
  }, [gameStarted, gameOver, birdVelocity, birdY]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #38bdf8, #7dd3fc)',
  };

  const wrapperStyle = {
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const gameAreaStyle = {
    position: 'relative',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: '#bae6fd',
    border: '4px solid #d97706',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const birdStyle = {
    position: 'absolute',
    width: 32,
    height: 32,
    background: '#facc15',
    border: '2px solid #ca8a04',
    borderRadius: '50%',
    left: 100,
    top: birdY,
    transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
    transition: 'transform 0.1s',
  };

  const birdEyeStyle = {
    position: 'absolute',
    width: 8,
    height: 8,
    background: 'black',
    borderRadius: '50%',
    top: 8,
    right: 4,
  };

  const pipeStyle = {
    position: 'absolute',
    background: '#16a34a',
    border: '4px solid #15803d',
    width: PIPE_WIDTH,
  };

  const scoreStyle = {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const overlayContentStyle = {
    textAlign: 'center',
  };

  const gameOverTitleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
  };

  const scoreTextStyle = {
    fontSize: '1.5rem',
    color: 'white',
    marginBottom: '0.5rem',
  };

  const highScoreTextStyle = {
    fontSize: '1.25rem',
    color: '#fde047',
    marginBottom: '1.5rem',
  };

  const startTextStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1.5rem',
  };

  const retryTextStyle = {
    fontSize: '1.5rem',
    color: 'white',
  };

  const instructionsStyle = {
    marginTop: '1rem',
    color: 'white',
    fontSize: '0.875rem',
  };

  const instructionTextStyle = {
    marginTop: '0.25rem',
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <h1 style={titleStyle}>Mzansi Baddie</h1>
        
        <div style={gameAreaStyle} onClick={jump}>
          <div style={birdStyle}>
            <div style={birdEyeStyle}></div>
          </div>

          {pipes.map((pipe, i) => (
            <React.Fragment key={i}>
              <div 
                style={{
                  ...pipeStyle,
                  left: pipe.x,
                  top: 0,
                  height: pipe.gapY,
                }}
              />
              <div 
                style={{
                  ...pipeStyle,
                  left: pipe.x,
                  top: pipe.gapY + PIPE_GAP,
                  height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
                }}
              />
            </React.Fragment>
          ))}

          <div style={scoreStyle}>{score}</div>

          {(!gameStarted || gameOver) && (
            <div style={overlayStyle}>
              <div style={overlayContentStyle}>
                {gameOver && (
                  <>
                    <h2 style={gameOverTitleStyle}>Game Over!</h2>
                    <p style={scoreTextStyle}>Score: {score}</p>
                    <p style={highScoreTextStyle}>High Score: {highScore}</p>
                  </>
                )}
                {!gameStarted && (
                  <h2 style={startTextStyle}>Click or Press Space to Start</h2>
                )}
                {gameOver && (
                  <p style={retryTextStyle}>Click or Press Space to Retry</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={instructionsStyle}>
          <p>Click or press SPACE to flap</p>
          <p style={instructionTextStyle}>High Score: {highScore}</p>
        </div>
      </div>
    </div>
  );
}