import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Pause, Play } from 'lucide-react';

interface GamePlayScreenProps {
  gameTitle: string;
  onBack: () => void;
}

export function GamePlayScreen({ gameTitle, onBack }: GamePlayScreenProps) {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        // Simulate score increase
        if (Math.random() > 0.7) {
          setScore(prev => prev + Math.floor(Math.random() * 100) + 10);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePauseGame = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameContent = () => {
    switch (gameTitle.toLowerCase()) {
      case 'tetris':
        return (
          <div className="grid grid-cols-10 gap-1 bg-black p-4 rounded">
            {Array.from({ length: 200 }, (_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 border border-gray-700 ${
                  Math.random() > 0.8 && isPlaying ? 'bg-blue-500' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        );
      case 'snake':
        return (
          <div className="bg-green-900 p-4 rounded grid grid-cols-20 gap-px">
            {Array.from({ length: 400 }, (_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 ${
                  i % 43 === 0 && isPlaying ? 'bg-green-400' : 
                  i === 210 ? 'bg-red-500' : 'bg-green-800'
                }`}
              />
            ))}
          </div>
        );
      case 'pac-man':
        return (
          <div className="bg-black p-4 rounded">
            <div className="grid grid-cols-15 gap-1">
              {Array.from({ length: 225 }, (_, i) => {
                const isWall = i % 15 === 0 || i % 15 === 14 || i < 15 || i > 210;
                const isDot = !isWall && i % 3 === 0;
                const isPacman = i === 112;
                return (
                  <div 
                    key={i} 
                    className={`w-4 h-4 ${
                      isWall ? 'bg-blue-600' :
                      isPacman ? 'bg-yellow-400 rounded-full' :
                      isDot ? 'bg-yellow-200 rounded-full' : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-900 p-8 rounded-lg text-center">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-white">Game simulation for {gameTitle}</p>
            <p className="text-gray-400 mt-2">Use arrow keys to play!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:text-gray-300 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Computer</span>
        </Button>
        
        <h1 className="text-2xl font-mono text-green-400">{gameTitle.toUpperCase()}</h1>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-xl font-mono text-yellow-400">{score.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Time</div>
            <div className="text-xl font-mono text-blue-400">{formatTime(timeElapsed)}</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center justify-center space-y-6">
        {!isPlaying ? (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">
              {gameTitle.toLowerCase() === 'tetris' ? '🟦' :
               gameTitle.toLowerCase() === 'snake' ? '🐍' :
               gameTitle.toLowerCase() === 'pac-man' ? '👻' :
               '🎮'}
            </div>
            <div>
              <h2 className="text-4xl font-mono text-green-400 mb-2">{gameTitle.toUpperCase()}</h2>
              <p className="text-gray-400 mb-6">Ready to start your game?</p>
              <Button
                onClick={handleStartGame}
                className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 text-lg font-mono"
              >
                START GAME
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Game Content */}
            <div className="border-2 border-green-400 p-2 bg-black rounded">
              {getGameContent()}
            </div>
            
            {/* Game Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handlePauseGame}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </div>
            
            {isPaused && (
              <div className="text-center">
                <div className="text-yellow-400 font-mono text-2xl animate-pulse">GAME PAUSED</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-sm text-gray-400">
          <span className="text-green-400">CONTROLS:</span> Arrow Keys = Move | Space = Action | ESC = Pause
        </div>
      </div>
    </div>
  );
}