import React, { useState, useEffect, useRef } from "react";
import { mockGames } from "../data/mockData";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// Tetris pieces with colors
const TETRIS_PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: "cyan" },
  J: { shape: [[0, 0, 1], [1, 1, 1]], color: "blue" },
  L: { shape: [[1, 0, 0], [1, 1, 1]], color: "orange" },
  O: { shape: [[1, 1], [1, 1]], color: "yellow" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "green" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "purple" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "red" },
};

const randomTetromino = () => {
  const tetros = Object.keys(TETRIS_PIECES);
  const rand = tetros[Math.floor(Math.random() * tetros.length)];
  return { ...TETRIS_PIECES[rand], name: rand };
};

// Pac-Man constants
const PACMAN_EMPTY = 0;
const PACMAN_WALL = 1;
const PACMAN_PELLET = 2;
const PACMAN_PLAYER = 3;
const PACMAN_GHOST = 4;

const PACMAN_ROWS = 12;
const PACMAN_COLS = 12;

const INITIAL_PACMAN_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1],
  [1,1,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,1],
  [1,4,1,1,1,1,1,1,1,1,4,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
];

const INITIAL_PACMAN_POS = { x: 1, y: 1 };
const INITIAL_GHOSTS = [
  { x: 1, y: 10 },
  { x: 10, y: 10 },
];

interface ArcadeGamesPageProps {
  onGameSelect?: (gameId: number, gameTitle: string) => void;
}

export function ArcadeGamesPage({ onGameSelect }: ArcadeGamesPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coins, setCoins] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<string>('');
  
  // Snake game state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  
  // Tetris game state
  const [tetrisGrid, setTetrisGrid] = useState<(string | null)[][]>(Array.from({length:20}, ()=>Array(10).fill(null)));
  const [tetrisPiece, setTetrisPiece] = useState<{shape: number[][], pos: {x: number, y: number}, color: string, name: string}>({
    ...randomTetromino(), pos: { x: 3, y: 0 }
  });
  
  // Pac-Man game state
  const [pacmanMap, setPacmanMap] = useState(INITIAL_PACMAN_MAP.map(row => [...row]));
  const [pacmanPos, setPacmanPos] = useState(INITIAL_PACMAN_POS);
  const [ghosts, setGhosts] = useState(INITIAL_GHOSTS);
  
  // Common game state
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [trophiesEarned, setTrophiesEarned] = useState(0);
  const [showTrophyNotification, setShowTrophyNotification] = useState(false);

  // Timer for tracking play time and awarding trophies
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timerInterval = setInterval(() => {
      setPlayTime(prev => {
        const newTime = prev + 1;
        
        // Award 3 trophies after 5 minutes (300 seconds)
        if (newTime === 300 && trophiesEarned === 0) {
          setTrophiesEarned(3);
          setShowTrophyNotification(true);
          // Hide notification after 5 seconds
          setTimeout(() => setShowTrophyNotification(false), 5000);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isPlaying, gameOver, trophiesEarned]);

  // Snake game logic
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'snake') return;

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
        
        // Check wall collision
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15) {
          setGameOver(true);
          return prevSnake;
        }
        
        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }
        
        newSnake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 15)
          });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameInterval);
  }, [direction, food, isPlaying, gameOver, currentGameType]);

  // Tetris helper functions
  const tetrisCollision = (tetro: typeof tetrisPiece, dx = 0, dy = 0, newShape: number[][] | null = null) => {
    const shape = newShape || tetro.shape;
    return shape.some((row, y) =>
      row.some((cell, x) =>
        cell &&
        (tetro.pos.y + y + dy >= 20 ||
          tetro.pos.y + y + dy < 0 ||
          tetro.pos.x + x + dx < 0 ||
          tetro.pos.x + x + dx >= 10 ||
          (tetro.pos.y + y + dy >= 0 && tetrisGrid[tetro.pos.y + y + dy][tetro.pos.x + x + dx]))
      )
    );
  };

  const tetrisRotate = (matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
  };

  const tetrisFixPiece = () => {
    const newGrid = tetrisGrid.map(row => [...row]);
    tetrisPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && tetrisPiece.pos.y + y >= 0) {
          newGrid[tetrisPiece.pos.y + y][tetrisPiece.pos.x + x] = tetrisPiece.color;
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    for (let y = 19; y >= 0; y--) {
      if (newGrid[y].every(cell => cell)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(10).fill(null));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      setScore(s => s + linesCleared * 100);
    }

    setTetrisGrid(newGrid);

    // Spawn new piece
    const newPiece = { ...randomTetromino(), pos: { x: 3, y: 0 } };
    setTetrisPiece(newPiece);

    // Check game over
    if (tetrisCollision(newPiece, 0, 0, null)) {
      setGameOver(true);
    }
  };

  const tetrisMove = (dx: number, dy: number) => {
    if (!tetrisCollision(tetrisPiece, dx, dy)) {
      setTetrisPiece(prev => ({
        ...prev,
        pos: { x: prev.pos.x + dx, y: prev.pos.y + dy }
      }));
    } else if (dy === 1) {
      tetrisFixPiece();
    }
  };

  // Tetris game logic - auto drop
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'tetris') return;

    const gameInterval = setInterval(() => {
      tetrisMove(0, 1);
    }, 500);

    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver, currentGameType, tetrisPiece, tetrisGrid]);

  // Pac-Man helper functions
  const pacmanMove = (dx: number, dy: number) => {
    if (gameOver) return;
    
    const nx = pacmanPos.x + dx;
    const ny = pacmanPos.y + dy;
    
    if (pacmanMap[ny][nx] !== PACMAN_WALL) {
      const newScore = pacmanMap[ny][nx] === PACMAN_PELLET ? score + 10 : score;
      const newMap = pacmanMap.map(row => [...row]);
      newMap[pacmanPos.y][pacmanPos.x] = PACMAN_EMPTY;
      newMap[ny][nx] = PACMAN_PLAYER;
      setPacmanMap(newMap);
      setPacmanPos({ x: nx, y: ny });
      setScore(newScore);

      // Check collisions with ghosts
      ghosts.forEach(g => {
        if (g.x === nx && g.y === ny) setGameOver(true);
      });
    }
  };

  const pacmanMoveGhosts = () => {
    if (gameOver) return;
    
    const newGhosts = ghosts.map(g => {
      const directions = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
      ];
      
      const valid = directions.filter(({ dx, dy }) => {
        const nx = g.x + dx;
        const ny = g.y + dy;
        return pacmanMap[ny][nx] !== PACMAN_WALL;
      });
      
      if (valid.length === 0) return g;
      
      const move = valid[Math.floor(Math.random() * valid.length)];
      return { x: g.x + move.dx, y: g.y + move.dy };
    });

    // Check collisions with Pac-Man
    newGhosts.forEach(g => {
      if (g.x === pacmanPos.x && g.y === pacmanPos.y) setGameOver(true);
    });

    // Update map for ghosts
    const newMap = pacmanMap.map(row => row.map(cell => (cell === PACMAN_GHOST ? PACMAN_EMPTY : cell)));
    newGhosts.forEach(g => newMap[g.y][g.x] = PACMAN_GHOST);
    newMap[pacmanPos.y][pacmanPos.x] = PACMAN_PLAYER;

    setGhosts(newGhosts);
    setPacmanMap(newMap);
  };

  // Pac-Man game logic - ghost AI
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'pac-man') return;

    const ghostInterval = setInterval(() => {
      pacmanMoveGhosts();
    }, 500);

    return () => clearInterval(ghostInterval);
  }, [isPlaying, gameOver, currentGameType, pacmanPos, ghosts, pacmanMap]);

  const navigateLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockGames.length - 1 : prev - 1));
  };

  const navigateRight = () => {
    setCurrentIndex((prev) => (prev === mockGames.length - 1 ? 0 : prev + 1));
  };

  const handleSelectGame = () => {
    if (coins > 0) {
      const currentGame = mockGames[currentIndex];
      const gameType = currentGame.title.toLowerCase();
      
      setCoins(coins - 1);
      setIsPlaying(true);
      setGameOver(false);
      setScore(0);
      setPlayTime(0);
      setCurrentGameType(gameType);
      
      // Initialize game-specific state
      if (gameType === 'snake') {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 0, y: 1 });
        setFood({ x: 5, y: 5 });
      } else if (gameType === 'tetris') {
        setTetrisGrid(Array.from({length:20}, ()=>Array(10).fill(null)));
        setTetrisPiece({ ...randomTetromino(), pos: { x: 3, y: 0 } });
      } else if (gameType === 'pac-man') {
        setPacmanMap(INITIAL_PACMAN_MAP.map(row => [...row]));
        setPacmanPos(INITIAL_PACMAN_POS);
        setGhosts(INITIAL_GHOSTS);
      }
    }
  };

  // Keyboard navigation and game controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPlaying) {
        if (currentGameType === 'snake') {
          // Snake controls
          if (e.key === "ArrowUp" && direction.y !== 1) {
            setDirection({ x: 0, y: -1 });
          } else if (e.key === "ArrowDown" && direction.y !== -1) {
            setDirection({ x: 0, y: 1 });
          } else if (e.key === "ArrowLeft" && direction.x !== 1) {
            setDirection({ x: -1, y: 0 });
          } else if (e.key === "ArrowRight" && direction.x !== -1) {
            setDirection({ x: 1, y: 0 });
          }
        } else if (currentGameType === 'tetris') {
          // Tetris controls
          if (e.key === "ArrowLeft") {
            tetrisMove(-1, 0);
          } else if (e.key === "ArrowRight") {
            tetrisMove(1, 0);
          } else if (e.key === "ArrowDown") {
            tetrisMove(0, 1);
          } else if (e.key === "ArrowUp") {
            const rotated = tetrisRotate(tetrisPiece.shape);
            if (!tetrisCollision(tetrisPiece, 0, 0, rotated)) {
              setTetrisPiece(prev => ({ ...prev, shape: rotated }));
            }
          }
        } else if (currentGameType === 'pac-man') {
          // Pac-Man controls
          if (e.key === "ArrowUp") {
            pacmanMove(0, -1);
          } else if (e.key === "ArrowDown") {
            pacmanMove(0, 1);
          } else if (e.key === "ArrowLeft") {
            pacmanMove(-1, 0);
          } else if (e.key === "ArrowRight") {
            pacmanMove(1, 0);
          }
        }
      } else {
        // Menu navigation
        if (e.key === "ArrowLeft") {
          navigateLeft();
        } else if (e.key === "ArrowRight") {
          navigateRight();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isPlaying, direction, coins, currentGameType, tetrisPiece, tetrisGrid, pacmanPos, ghosts, pacmanMap]);

  const handleBackToMenu = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setPlayTime(0);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentGame = mockGames[currentIndex];
  const prevGame = mockGames[currentIndex === 0 ? mockGames.length - 1 : currentIndex - 1];
  const nextGame = mockGames[currentIndex === mockGames.length - 1 ? 0 : currentIndex + 1];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="scanlines pointer-events-none"></div>
      
      {/* CRT Grid background */}
      <div className="crt-grid"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Coin Counter */}
        <div className="absolute top-8 right-8 neon-text-cyan pixel-text text-2xl animate-pulse">
          CREDITS: {coins}
        </div>

        {/* Arcade Cabinet Frame */}
        <div className="arcade-cabinet relative">
          {/* Top Panel */}
          <div className="arcade-top">
            <div className="neon-border-cyan rounded-t-3xl p-8 bg-gradient-to-b from-gray-900 to-black">
              <h1 className="pixel-text text-5xl text-center neon-text-cyan mb-2 tracking-wider">
                GAME ARCADE
              </h1>
              <div className="text-center neon-text-magenta pixel-text text-xl animate-blink">
                ◆ INSERT COIN ◆
              </div>
            </div>
          </div>

          {/* Screen */}
          <div className="arcade-screen relative">
            <div className="neon-border-cyan bg-black p-8 relative overflow-hidden">
              {/* CRT Screen effect */}
              <div className="crt-screen rounded-lg p-8 relative">
                {!isPlaying ? (
                  <>
                {/* Game Carousel */}
                <div className="flex items-center justify-center space-x-8 mb-8">
                  {/* Previous Game (Blurred) */}
                  <div className="game-card-side opacity-30 blur-sm">
                    <div className="text-6xl mb-4">{prevGame.thumbnail}</div>
                    <div className="pixel-text text-lg neon-text-cyan">{prevGame.title}</div>
                  </div>

                  {/* Current Game (Focused) */}
                  <div className="game-card-center">
                    <div className="neon-border-magenta rounded-lg p-8 bg-gradient-to-b from-purple-900/20 to-blue-900/20">
                      <div className="text-9xl mb-6 text-center animate-float">{currentGame.thumbnail}</div>
                      <h2 className="pixel-text text-4xl neon-text-magenta text-center mb-6 tracking-wider">
                        {currentGame.title.toUpperCase()}
                      </h2>
                      
                      {/* Game Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between pixel-text text-sm">
                          <span className="neon-text-cyan">⚡ DIFFICULTY:</span>
                          <span className="neon-text-yellow">{currentGame.difficulty.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between pixel-text text-sm">
                          <span className="neon-text-cyan">⏱ TIME:</span>
                          <span className="neon-text-yellow">{currentGame.time}</span>
                        </div>
                        <div className="flex items-center justify-between pixel-text text-sm">
                          <span className="neon-text-cyan">🏆 REWARD:</span>
                          <span className="neon-text-yellow">{currentGame.reward} PTS</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-center text-gray-400 pixel-text text-sm mb-6">
                        {currentGame.description}
                      </p>
                    </div>
                  </div>

                  {/* Next Game (Blurred) */}
                  <div className="game-card-side opacity-30 blur-sm">
                    <div className="text-6xl mb-4">{nextGame.thumbnail}</div>
                    <div className="pixel-text text-lg neon-text-cyan">{nextGame.title}</div>
                  </div>
                </div>

                {/* Game Counter */}
                <div className="text-center pixel-text text-sm neon-text-cyan mb-4">
                  {currentIndex + 1} / {mockGames.length}
                </div>
                  </>
                ) : (
                  <>
                    {/* Active Game Header */}
                    <div className="mb-4 flex justify-between items-center">
                      <button 
                        onClick={handleBackToMenu}
                        className="neon-button-cyan px-4 py-2 rounded pixel-text text-xs flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> BACK
                      </button>
                      <div className="flex gap-4 items-center">
                        <div className="pixel-text neon-text-yellow text-xl">SCORE: {score}</div>
                        <div className="pixel-text neon-text-cyan text-lg">TIME: {formatTime(playTime)}</div>
                        {trophiesEarned > 0 && (
                          <div className="pixel-text neon-text-magenta text-lg animate-pulse">
                            🏆 x{trophiesEarned}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Game Container */}
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 rounded-lg border-4 border-cyan-500/30 relative">
                      {/* Snake Game */}
                      {currentGameType === 'snake' && (
                        <div className="grid gap-0.5" style={{ 
                          gridTemplateColumns: 'repeat(20, 1fr)',
                          gridTemplateRows: 'repeat(15, 1fr)',
                        }}>
                          {Array.from({ length: 15 }).map((_, y) =>
                            Array.from({ length: 20 }).map((_, x) => {
                              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                              const isFood = food.x === x && food.y === y;
                              const isHead = snake[0].x === x && snake[0].y === y;
                              
                              return (
                                <div
                                  key={`${x}-${y}`}
                                  className={`aspect-square rounded-sm ${
                                    isHead
                                      ? 'bg-green-400 shadow-lg shadow-green-400/50'
                                      : isSnake
                                      ? 'bg-green-500'
                                      : isFood
                                      ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                                      : 'bg-gray-800/20'
                                  }`}
                                />
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* Tetris Game */}
                      {currentGameType === 'tetris' && (() => {
                        // Create display grid with current piece drawn
                        const displayGrid = tetrisGrid.map(row => [...row]);
                        tetrisPiece.shape.forEach((row, y) => {
                          row.forEach((cell, x) => {
                            if (cell && tetrisPiece.pos.y + y >= 0) {
                              const gx = tetrisPiece.pos.x + x;
                              const gy = tetrisPiece.pos.y + y;
                              if (gy < 20 && gx >= 0 && gx < 10) {
                                displayGrid[gy][gx] = tetrisPiece.color;
                              }
                            }
                          });
                        });

                        const colorMap: { [key: string]: string } = {
                          cyan: 'bg-cyan-400 shadow-lg shadow-cyan-400/50',
                          blue: 'bg-blue-500 shadow-lg shadow-blue-500/50',
                          orange: 'bg-orange-500 shadow-lg shadow-orange-500/50',
                          yellow: 'bg-yellow-400 shadow-lg shadow-yellow-400/50',
                          green: 'bg-green-500 shadow-lg shadow-green-500/50',
                          purple: 'bg-purple-500 shadow-lg shadow-purple-500/50',
                          red: 'bg-red-500 shadow-lg shadow-red-500/50',
                        };

                        return (
                          <div className="grid gap-0.5" style={{ 
                            gridTemplateColumns: 'repeat(10, 1fr)',
                            gridTemplateRows: 'repeat(20, 1fr)',
                            maxWidth: '300px',
                            margin: '0 auto'
                          }}>
                            {displayGrid.flat().map((cell, idx) => (
                              <div
                                key={idx}
                                className={`aspect-square rounded-sm ${
                                  cell ? colorMap[cell] || 'bg-cyan-400' : 'bg-gray-800/20'
                                }`}
                              />
                            ))}
                          </div>
                        );
                      })()}

                      {/* Pac-Man Game */}
                      {currentGameType === 'pac-man' && (
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: `repeat(${PACMAN_COLS}, 25px)`,
                          gridTemplateRows: `repeat(${PACMAN_ROWS}, 25px)`,
                          maxWidth: '350px',
                          margin: '0 auto'
                        }}>
                          {pacmanMap.flat().map((cell, idx) => {
                            let cellStyle: React.CSSProperties = {
                              width: '25px',
                              height: '25px',
                              backgroundColor: '#222',
                              borderRadius: '0%',
                              border: '1px solid #333',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            };
                            
                            if (cell === PACMAN_WALL) {
                              cellStyle.backgroundColor = '#000080';
                              cellStyle.border = '1px solid #4169E1';
                            } else if (cell === PACMAN_PELLET) {
                              cellStyle.backgroundColor = '#222';
                            } else if (cell === PACMAN_PLAYER) {
                              cellStyle.backgroundColor = '#FFD700';
                              cellStyle.borderRadius = '50%';
                              cellStyle.boxShadow = '0 0 10px #FFD700';
                            } else if (cell === PACMAN_GHOST) {
                              cellStyle.backgroundColor = '#FF0000';
                              cellStyle.borderRadius = '50%';
                              cellStyle.boxShadow = '0 0 10px #FF0000';
                            }
                            
                            return (
                              <div
                                key={idx}
                                style={cellStyle}
                              >
                                {cell === PACMAN_PELLET && (
                                  <div 
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      backgroundColor: '#FFD700',
                                      borderRadius: '50%',
                                      boxShadow: '0 0 4px #FFD700'
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Game Over Overlay */}
                      {gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                          <div className="text-center">
                            <div className="pixel-text text-4xl neon-text-magenta mb-4">GAME OVER!</div>
                            <div className="pixel-text text-2xl neon-text-yellow mb-2">Final Score: {score}</div>
                            <div className="pixel-text text-lg neon-text-cyan mb-2">Time Played: {formatTime(playTime)}</div>
                            {trophiesEarned > 0 && (
                              <div className="pixel-text text-2xl neon-text-magenta mb-4 animate-pulse">
                                🏆 {trophiesEarned} Trophies Earned!
                              </div>
                            )}
                            <button
                              onClick={handleSelectGame}
                              disabled={coins === 0}
                              className="neon-button-cyan px-8 py-3 rounded-lg pixel-text mt-4"
                            >
                              {coins > 0 ? 'PLAY AGAIN' : 'NO CREDITS'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Trophy Achievement Notification */}
                      {showTrophyNotification && !gameOver && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                          <div className="neon-border-magenta rounded-lg p-6 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 shadow-2xl animate-bounce">
                            <div className="text-center">
                              <div className="text-6xl mb-2">🏆🏆🏆</div>
                              <div className="pixel-text text-2xl neon-text-magenta mb-2">ACHIEVEMENT UNLOCKED!</div>
                              <div className="pixel-text text-lg neon-text-yellow">5-Minute Master</div>
                              <div className="pixel-text text-sm neon-text-cyan mt-2">+3 Trophies Added to Profile!</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Controls Help */}
                    <div className="mt-4 text-center space-y-1">
                      {currentGameType === 'snake' && (
                        <div className="pixel-text text-xs neon-text-cyan">
                          USE ARROW KEYS TO MOVE  •  EAT FOOD TO GROW
                        </div>
                      )}
                      {currentGameType === 'tetris' && (
                        <div className="pixel-text text-xs neon-text-cyan">
                          ARROW KEYS: MOVE  •  UP: ROTATE  •  DOWN: DROP FASTER
                        </div>
                      )}
                      {currentGameType === 'pac-man' && (
                        <div className="pixel-text text-xs neon-text-cyan">
                          ARROW KEYS: MOVE  •  COLLECT PELLETS  •  AVOID GHOSTS
                        </div>
                      )}
                      {playTime < 300 && (
                        <div className="pixel-text text-xs neon-text-magenta animate-pulse">
                          🏆 Play for 5 minutes to earn 3 trophies! ({formatTime(300 - playTime)} remaining)
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="arcade-controls">
            <div className="neon-border-cyan rounded-b-3xl p-8 bg-gradient-to-t from-gray-900 to-black">
              {/* Joystick and Buttons Visual */}
              <div className="flex items-center justify-center space-x-12 mb-6">
                {/* Left Joystick */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 neon-border-cyan rounded-full bg-gray-800 flex items-center justify-center mb-2">
                    <div className="w-12 h-12 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                  </div>
                  <div className="pixel-text text-xs neon-text-cyan">MOVE</div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 neon-border-yellow flex items-center justify-center">
                      <span className="pixel-text text-black text-xs">A</span>
                    </div>
                    <div className="pixel-text text-xs neon-text-cyan mt-2">ACTION</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full shadow-lg shadow-red-500/50 neon-border-magenta flex items-center justify-center">
                      <span className="pixel-text text-white text-xs">B</span>
                    </div>
                    <div className="pixel-text text-xs neon-text-cyan mt-2">JUMP</div>
                  </div>
                </div>

                {/* Right Joystick */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 neon-border-cyan rounded-full bg-gray-800 flex items-center justify-center mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </div>
                  <div className="pixel-text text-xs neon-text-cyan">AIM</div>
                </div>
              </div>

              {/* Navigation Controls */}
              {!isPlaying && (
                <>
              <div className="flex items-center justify-center space-x-8 mb-6">
                <button
                  onClick={navigateLeft}
                  className="neon-button-cyan w-16 h-16 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={handleSelectGame}
                  disabled={coins === 0}
                  className={`neon-button-magenta px-12 py-4 rounded-lg pixel-text text-xl tracking-wider hover:scale-105 transition-transform ${
                    coins === 0 ? "opacity-50 cursor-not-allowed" : "animate-pulse-slow"
                  }`}
                >
                  {coins > 0 ? "▶ PRESS START ◀" : "NO CREDITS"}
                </button>

                <button
                  onClick={navigateRight}
                  className="neon-button-cyan w-16 h-16 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Instructions */}
              <div className="text-center pixel-text text-sm neon-text-yellow">
                ← → TO BROWSE  •  ENTER TO SELECT
              </div>
                </>
              )}
              
              {isPlaying && (
                <div className="text-center pixel-text text-lg neon-text-magenta animate-pulse">
                  ◆ GAME IN PROGRESS ◆
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insert Coin Message */}
        <div className="mt-8 text-center">
          <div className="pixel-text text-lg neon-text-magenta animate-blink">
            {isPlaying ? "◆ GOOD LUCK ◆" : coins === 0 ? "◆ INSERT MORE COINS ◆" : "◆ READY PLAYER ONE ◆"}
          </div>
        </div>
      </div>
    </div>
  );
}