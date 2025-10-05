import React, { useState, useEffect, useRef } from 'react';

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(0.5 * Math.min(window.innerHeight * 0.8, 568));
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameDimensions, setGameDimensions] = useState({
    width: Math.min(window.innerWidth * 0.9, 320),
    height: Math.min(window.innerHeight * 0.8, 568),
  });
  const gameLoop = useRef(null);
  const pipeTimer = useRef(null);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const BIRD_SIZE = gameDimensions.width * 0.1; // 10% of game width
  const PIPE_WIDTH = gameDimensions.width * 0.15; // 15% of game width
  const PIPE_GAP = gameDimensions.height * 0.3; // 30% of game height

  // Update dimensions on resize/orientation change
  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth * 0.9, 400);
      const newHeight = Math.min(window.innerHeight * 0.8, 600);
      setGameDimensions({ width: newWidth, height: newHeight });
      if (!gameStarted) {
        setBirdY(newHeight * 0.5);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gameStarted]);

  const jump = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setBirdY(gameDimensions.height * 0.5);
      setBirdVelocity(JUMP_STRENGTH);
      setPipes([]);
      setScore(0);
    } else if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
    } else {
      setGameStarted(true);
      setGameOver(false);
      setBirdY(gameDimensions.height * 0.5);
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
        const gapY = Math.random() * (gameDimensions.height - PIPE_GAP - 100) + 50;
        setPipes(prev => [...prev, { x: gameDimensions.width, gapY, passed: false }]);
      }, 2000);

      return () => clearInterval(pipeTimer.current);
    }
  }, [gameStarted, gameOver, gameDimensions]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(() => {
        setBirdVelocity(v => v + GRAVITY);
        setBirdY(y => {
          const newY = y + birdVelocity;
          if (newY < 0 || newY > gameDimensions.height - BIRD_SIZE) {
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
            if (!pipe.passed && pipe.x + PIPE_WIDTH < gameDimensions.width * 0.25) {
              pipe.passed = true;
              setScore(s => s + 1);
            }

            const birdLeft = gameDimensions.width * 0.25;
            const birdRight = birdLeft + BIRD_SIZE;
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
  }, [gameStarted, gameOver, birdVelocity, birdY, gameDimensions]);

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
    width: '100%',
    maxWidth: '400px',
    padding: '0 1rem',
  };

  const titleStyle = {
    fontSize: 'clamp(1.5rem, 7vw, 2rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const gameAreaStyle = {
    position: 'relative',
    width: gameDimensions.width,
    height: gameDimensions.height,
    background: '#bae6fd',
    border: '4px solid #d97706',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    cursor: 'pointer',
    touchAction: 'manipulation', // Prevents pinch-zoom/scroll
  };

  const birdStyle = {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    background: '#facc15',
    border: '2px solid #ca8a04',
    borderRadius: '50%',
    left: gameDimensions.width * 0.25,
    top: birdY,
    transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
    transition: 'transform 0.1s',
  };

  const birdEyeStyle = {
    position: 'absolute',
    width: BIRD_SIZE * 0.25,
    height: BIRD_SIZE * 0.25,
    background: 'black',
    borderRadius: '50%',
    top: BIRD_SIZE * 0.25,
    right: BIRD_SIZE * 0.125,
  };

  const pipeStyle = {
    position: 'absolute',
    background: '#16a34a',
    border: '4px solid #15803d',
    width: PIPE_WIDTH,
  };

  const scoreStyle = {
    position: 'absolute',
    top: 'clamp(0.75rem, 4vw, 1rem)',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 'clamp(1.5rem, 7vw, 2rem)',
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
    fontSize: 'clamp(2rem, 8vw, 2.5rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
  };

  const scoreTextStyle = {
    fontSize: 'clamp(1rem, 5vw, 1.25rem)',
    color: 'white',
    marginBottom: '0.5rem',
  };

  const highScoreTextStyle = {
    fontSize: 'clamp(0.875rem, 4vw, 1rem)',
    color: '#fde047',
    marginBottom: '1.5rem',
  };

  const startTextStyle = {
    fontSize: 'clamp(1.25rem, 6vw, 1.5rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1.5rem',
  };

  const retryTextStyle = {
    fontSize: 'clamp(1rem, 5vw, 1.25rem)',
    color: 'white',
  };

  const instructionsStyle = {
    marginTop: '1rem',
    color: 'white',
    fontSize: 'clamp(0.75rem, 4vw, 0.875rem)',
  };

  const instructionTextStyle = {
    marginTop: '0.25rem',
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <h1 style={titleStyle}>Mzansi Baddie</h1>
        
        <div
          style={gameAreaStyle}
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
        >
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
                  height: gameDimensions.height - pipe.gapY - PIPE_GAP,
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
                  <h2 style={startTextStyle}>Tap or Press Space to Start</h2>
                )}
                {gameOver && (
                  <p style={retryTextStyle}>Tap or Press Space to Retry</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={instructionsStyle}>
          <p>Tap or press SPACE to flap</p>
          <p style={instructionTextStyle}>High Score: {highScore}</p>
        </div>
      </div>
    </div>
  );
}