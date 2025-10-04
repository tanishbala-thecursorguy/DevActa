import { useState, useEffect } from "react";
import { mockGames } from "../data/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArcadeGamesPageProps {
  onGameSelect?: (gameId: number, gameTitle: string) => void;
}

export function ArcadeGamesPage({ onGameSelect }: ArcadeGamesPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coins, setCoins] = useState(5);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateLeft();
      } else if (e.key === "ArrowRight") {
        navigateRight();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelectGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  const navigateLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockGames.length - 1 : prev - 1));
  };

  const navigateRight = () => {
    setCurrentIndex((prev) => (prev === mockGames.length - 1 ? 0 : prev + 1));
  };

  const handleSelectGame = () => {
    if (coins > 0) {
      const game = mockGames[currentIndex];
      onGameSelect?.(game.id, game.title);
      setCoins(coins - 1);
    }
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
            </div>
          </div>
        </div>

        {/* Insert Coin Message */}
        <div className="mt-8 text-center">
          <div className="pixel-text text-lg neon-text-magenta animate-blink">
            {coins === 0 ? "◆ INSERT MORE COINS ◆" : "◆ READY PLAYER ONE ◆"}
          </div>
        </div>
      </div>
    </div>
  );
}