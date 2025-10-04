import React, { useState, useEffect } from "react";
import { mockGames } from "../data/mockData";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface ArcadeGamesPageProps {
  onGameSelect?: (gameId: number, gameTitle: string) => void;
}

export function ArcadeGamesPage({ onGameSelect }: ArcadeGamesPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coins, setCoins] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Snake game logic
  useEffect(() => {
    if (!isPlaying || gameOver) return;

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
  }, [direction, food, isPlaying, gameOver]);

  // Keyboard navigation and game controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPlaying) {
        // Game controls
        if (e.key === "ArrowUp" && direction.y !== 1) {
          setDirection({ x: 0, y: -1 });
        } else if (e.key === "ArrowDown" && direction.y !== -1) {
          setDirection({ x: 0, y: 1 });
        } else if (e.key === "ArrowLeft" && direction.x !== 1) {
          setDirection({ x: -1, y: 0 });
        } else if (e.key === "ArrowRight" && direction.x !== -1) {
          setDirection({ x: 1, y: 0 });
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
  }, [currentIndex, isPlaying, direction]);

  const navigateLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockGames.length - 1 : prev - 1));
  };

  const navigateRight = () => {
    setCurrentIndex((prev) => (prev === mockGames.length - 1 ? 0 : prev + 1));
  };

  const handleSelectGame = () => {
    if (coins > 0) {
      setCoins(coins - 1);
      setIsPlaying(true);
      setGameOver(false);
      setScore(0);
      setSnake([{ x: 10, y: 10 }]);
      setDirection({ x: 0, y: 1 });
      setFood({ x: 5, y: 5 });
    }
  };

  const handleBackToMenu = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
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
                    {/* Active Game - Snake */}
                    <div className="mb-4 flex justify-between items-center">
                      <button 
                        onClick={handleBackToMenu}
                        className="neon-button-cyan px-4 py-2 rounded pixel-text text-xs flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> BACK
                      </button>
                      <div className="pixel-text neon-text-yellow text-xl">SCORE: {score}</div>
                    </div>

                    {/* Snake Game Grid */}
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 rounded-lg border-4 border-cyan-500/30 relative">
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
                      
                      {gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                          <div className="text-center">
                            <div className="pixel-text text-4xl neon-text-magenta mb-4">GAME OVER!</div>
                            <div className="pixel-text text-2xl neon-text-yellow mb-6">Final Score: {score}</div>
                            <button
                              onClick={handleSelectGame}
                              disabled={coins === 0}
                              className="neon-button-cyan px-8 py-3 rounded-lg pixel-text"
                            >
                              {coins > 0 ? 'PLAY AGAIN' : 'NO CREDITS'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Controls Help */}
                    <div className="mt-4 text-center pixel-text text-xs neon-text-cyan">
                      USE ARROW KEYS TO MOVE  •  EAT FOOD TO GROW
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