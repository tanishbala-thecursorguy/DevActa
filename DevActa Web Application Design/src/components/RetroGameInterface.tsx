import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './ui/button';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import retroComputerImage from 'figma:asset/9d1967dec7fb8eb3cf73ac967a084ef46f6f1601.png';

interface RetroGameInterfaceProps {
  gameTitle: string;
  onBack: () => void;
  onStartGame: () => void;
}

// ACTA Card Component
function ActaCard({ id, isInserted, onCardMove }: { id: string; isInserted: boolean; onCardMove: (cardId: string) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'acta-card',
    item: { id, type: 'acta-card' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onCardMove(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (isInserted) return null;

  return (
    <div
      ref={drag}
      className={`w-32 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-lg border-4 border-yellow-300 shadow-lg cursor-grab transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-xl'
      }`}
      style={{
        backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        boxShadow: isDragging ? '0 0 30px rgba(251, 191, 36, 0.6)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="h-full flex flex-col items-center justify-center text-black pixel-text">
        <div className="text-xs mb-1">ACTA</div>
        <div className="text-xl">🎮</div>
        <div className="text-xs">CARD</div>
      </div>
    </div>
  );
}

// Snake Game Component
function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 1 });
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-green-400">
      <div className="text-center mb-4">
        <h2 className="text-2xl pixel-text neon-text-cyan mb-2">🐍 SNAKE</h2>
        <p className="text-sm">SCORE: {score}</p>
      </div>
      
      {!isPlaying && !gameOver && (
        <div className="text-center mb-4">
          <p className="mb-4">Use arrow keys to control the snake!</p>
          <Button onClick={startGame} className="neon-button-cyan pixel-text">
            START GAME
          </Button>
        </div>
      )}
      
      {gameOver && (
        <div className="text-center mb-4">
          <p className="text-red-400 mb-2">GAME OVER!</p>
          <p className="mb-4">Final Score: {score}</p>
          <Button onClick={startGame} className="neon-button-cyan pixel-text mr-2">
            PLAY AGAIN
          </Button>
        </div>
      )}
      
      {(isPlaying || gameOver) && (
        <div className="relative border-2 border-green-400 bg-black/80" style={{ width: '320px', height: '240px' }}>
          {/* Game Board */}
          {Array.from({ length: 15 }, (_, y) =>
            Array.from({ length: 20 }, (_, x) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;
              const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`absolute ${
                    isSnake
                      ? isHead
                        ? 'bg-green-300'
                        : 'bg-green-500'
                      : isFood
                      ? 'bg-red-500'
                      : ''
                  }`}
                  style={{
                    left: x * 16,
                    top: y * 16,
                    width: 16,
                    height: 16,
                  }}
                >
                  {isFood && <span className="text-xs">🍎</span>}
                </div>
              );
            })
          )}
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <Button onClick={onBack} variant="outline" className="pixel-text">
          ← BACK
        </Button>
      </div>
    </div>
  );
}

// Pong Game Component  
function PongGame({ onBack }: { onBack: () => void }) {
  const [playerY, setPlayerY] = useState(120);
  const [aiY, setAiY] = useState(120);
  const [ballX, setBallX] = useState(160);
  const [ballY, setBallY] = useState(120);
  const [ballVelX, setBallVelX] = useState(3);
  const [ballVelY, setBallVelY] = useState(2);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setBallX(prev => {
        const newX = prev + ballVelX;
        
        // Ball hits left paddle
        if (newX <= 20 && ballY >= playerY - 40 && ballY <= playerY + 40) {
          setBallVelX(-ballVelX);
          return 20;
        }
        
        // Ball hits right paddle
        if (newX >= 300 && ballY >= aiY - 40 && ballY <= aiY + 40) {
          setBallVelX(-ballVelX);
          return 300;
        }
        
        // Ball goes off left side
        if (newX < 0) {
          setAiScore(prev => prev + 1);
          setBallX(160);
          setBallY(120);
          setBallVelX(3);
          setBallVelY(2);
          return 160;
        }
        
        // Ball goes off right side
        if (newX > 320) {
          setPlayerScore(prev => prev + 1);
          setBallX(160);
          setBallY(120);
          setBallVelX(-3);
          setBallVelY(2);
          return 160;
        }
        
        return newX;
      });
      
      setBallY(prev => {
        const newY = prev + ballVelY;
        if (newY <= 0 || newY >= 240) {
          setBallVelY(-ballVelY);
          return prev;
        }
        return newY;
      });
      
      // AI Movement
      setAiY(prev => {
        const diff = ballY - prev;
        if (Math.abs(diff) > 2) {
          return prev + (diff > 0 ? 2 : -2);
        }
        return prev;
      });
    }, 16);

    return () => clearInterval(gameInterval);
  }, [ballVelX, ballVelY, ballY, playerY, aiY, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      if (e.key === 'ArrowUp' && playerY > 40) {
        setPlayerY(prev => prev - 5);
      }
      if (e.key === 'ArrowDown' && playerY < 200) {
        setPlayerY(prev => prev + 5);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerY, isPlaying]);

  const startGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setBallX(160);
    setBallY(120);
    setBallVelX(3);
    setBallVelY(2);
    setPlayerY(120);
    setAiY(120);
    setIsPlaying(true);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-green-400">
      <div className="text-center mb-4">
        <h2 className="text-2xl pixel-text neon-text-cyan mb-2">🏓 PONG</h2>
        <p className="text-sm">PLAYER: {playerScore} | AI: {aiScore}</p>
      </div>
      
      {!isPlaying && (
        <div className="text-center mb-4">
          <p className="mb-4">Use arrow keys to move your paddle!</p>
          <Button onClick={startGame} className="neon-button-cyan pixel-text">
            START GAME
          </Button>
        </div>
      )}
      
      {isPlaying && (
        <div className="relative border-2 border-green-400 bg-black/80" style={{ width: '320px', height: '240px' }}>
          {/* Player Paddle */}
          <div
            className="absolute w-2 h-20 bg-green-400"
            style={{ left: 10, top: playerY - 40 }}
          />
          
          {/* AI Paddle */}
          <div
            className="absolute w-2 h-20 bg-green-400"
            style={{ left: 308, top: aiY - 40 }}
          />
          
          {/* Ball */}
          <div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ left: ballX - 1, top: ballY - 1 }}
          />
          
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-400 opacity-30" />
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <Button onClick={onBack} variant="outline" className="pixel-text">
          ← BACK
        </Button>
      </div>
    </div>
  );
}

// Card Slot Component - Gaming Style Coin Slot
function CardSlot({ onCardDrop, hasCard }: { onCardDrop: (cardId: string) => void; hasCard: boolean }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'acta-card',
    drop: (item: { id: string }) => {
      onCardDrop(item.id);
      return { name: 'CardSlot' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="relative">
      {/* Coin Slot Frame - Gaming Style */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border-4 border-gray-700 shadow-2xl">
        {/* Inner Slot */}
        <div
          ref={drop}
          className={`w-40 h-28 rounded-xl border-4 transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
            hasCard
              ? 'border-green-400 bg-gradient-to-br from-green-900/50 to-green-800/30 shadow-lg shadow-green-400/50'
              : isOver && canDrop
              ? 'border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 shadow-lg shadow-yellow-400/50 animate-pulse'
              : 'border-dashed border-yellow-600 bg-gradient-to-br from-gray-900/80 to-black/60'
          }`}
        >
          {/* Slot Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:8px_8px] opacity-30"></div>
          
          {hasCard ? (
            // Inserted Card Display
            <div className="relative w-36 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-lg border-4 border-yellow-300 shadow-lg animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-lg"></div>
              <div className="h-full flex flex-col items-center justify-center text-black pixel-text relative z-10">
                <div className="text-xs mb-1 animate-pulse">ACTA</div>
                <div className="text-2xl animate-bounce">🎮</div>
                <div className="text-xs animate-pulse">ACTIVE</div>
              </div>
              {/* Card Glow Effect */}
              <div className="absolute inset-0 border-2 border-green-300 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            // Empty Slot Display
            <div className="text-center relative z-10">
              {isOver && canDrop ? (
                <div className="text-yellow-400 pixel-text animate-bounce">
                  <div className="text-4xl mb-2">💳</div>
                  <div className="text-sm neon-text-yellow">DROP HERE!</div>
                </div>
              ) : (
                <div className="text-gray-400 pixel-text">
                  <div className="text-3xl mb-2 animate-bounce">🪙</div>
                  <div className="text-xs">COIN SLOT</div>
                  <div className="text-xs opacity-60">EMPTY</div>
                </div>
              )}
            </div>
          )}
          
          {/* Slot Shine Effect */}
          {!hasCard && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent animate-pulse"></div>
          )}
        </div>

        {/* Coin Slot Label */}
        <div className="text-center mt-2">
          <div className={`text-xs pixel-text ${hasCard ? 'text-green-400' : 'text-yellow-400'}`}>
            {hasCard ? '✅ CARD ACCEPTED' : '🪙 INSERT ACTA CARD'}
          </div>
        </div>
      </div>

      {/* Gaming Style Decorations */}
      {!hasCard && (
        <>
          {/* Corner Decorations */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"></div>
        </>
      )}
    </div>
  );
}

export function RetroGameInterface({ gameTitle, onBack, onStartGame }: RetroGameInterfaceProps) {
  const [showCursor, setShowCursor] = useState(true);
  const [bootText, setBootText] = useState('');
  const [isBooted, setIsBooted] = useState(false);
  const [cardInserted, setCardInserted] = useState(false);
  const [insertedCardId, setInsertedCardId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'boot' | 'game-selection' | 'playing'>('boot');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  // Available games data
  const availableGames = [
    {
      id: 1,
      title: "SNAKE",
      emoji: "🐍",
      difficulty: "EASY",
      time: "5-10 min",
      points: "10 PTS",
      description: "Eat food and grow longer"
    },
    {
      id: 2,
      title: "PONG",
      emoji: "🏓",
      difficulty: "MEDIUM",
      time: "3-8 min", 
      points: "15 PTS",
      description: "Classic ping pong battle"
    },
    {
      id: 3,
      title: "TETRIS",
      emoji: "🧩",
      difficulty: "HARD",
      time: "10-20 min",
      points: "25 PTS",
      description: "Stack blocks perfectly"
    },
    {
      id: 4,
      title: "PACMAN",
      emoji: "👻",
      difficulty: "MEDIUM",
      time: "8-15 min",
      points: "20 PTS",
      description: "Collect dots, avoid ghosts"
    },
    {
      id: 5,
      title: "SPACE",
      emoji: "🚀",
      difficulty: "HARD",
      time: "5-12 min",
      points: "30 PTS",
      description: "Shoot aliens from space"
    },
    {
      id: 6,
      title: "FROGGER",
      emoji: "🐸",
      difficulty: "EASY",
      time: "4-10 min",
      points: "12 PTS",
      description: "Cross the busy road safely"
    }
  ];

  const bootSequence = cardInserted 
    ? [
        'RETRO SYSTEM v2.1',
        'ACTA CARD DETECTED...',
        'Loading game modules...',
        'Initializing graphics...',
        'Authentication: SUCCESS',
        'Loading GAME ARCADE...',
        'Ready to select game!',
        ''
      ]
    : [
        'RETRO SYSTEM v2.1',
        'CARD SLOT: EMPTY',
        'INSERT ACTA CARD TO CONTINUE...',
        ''
      ];

  const handleCardDrop = (cardId: string) => {
    setCardInserted(true);
    setInsertedCardId(cardId);
    setBootText('');
    setIsBooted(false);
    setGameState('boot');
    // Restart boot sequence
    setTimeout(() => {
      setIsBooted(false);
    }, 100);
  };

  const handleCardRemove = () => {
    setCardInserted(false);
    setInsertedCardId(null);
    setBootText('');
    setIsBooted(false);
    setGameState('boot');
    setSelectedGameId(null);
  };

  const handleGameSelect = (gameId: number) => {
    setSelectedGameId(gameId);
    setGameState('playing');
  };

  const handleBackToGameSelection = () => {
    setGameState('game-selection');
    setSelectedGameId(null);
  };

  const availableCards = [
    { id: 'acta-1', name: 'ACTA Card #001' },
    { id: 'acta-2', name: 'ACTA Card #002' },
    { id: 'acta-3', name: 'ACTA Card #003' },
  ];

  useEffect(() => {
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(cursorInterval);
    };
  }, []);

  useEffect(() => {
    // Reset and start boot sequence when card state changes
    setBootText('');
    setIsBooted(false);
    
    const timer = setTimeout(() => {
      let currentLine = 0;
      const bootInterval = setInterval(() => {
        if (currentLine < bootSequence.length) {
          setBootText(prev => prev + bootSequence[currentLine] + '\n');
          currentLine++;
        } else {
          if (cardInserted) {
            setIsBooted(true);
            // After boot, show game selection
            setTimeout(() => {
              setGameState('game-selection');
            }, 1000);
          }
          clearInterval(bootInterval);
        }
      }, 800);

      return () => clearInterval(bootInterval);
    }, 200);

    return () => clearTimeout(timer);
  }, [cardInserted]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center p-4">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="absolute top-6 left-6 flex items-center space-x-2 text-amber-800 hover:text-amber-900 z-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Games</span>
        </Button>

        {/* Main Layout */}
        <div className="flex items-center justify-center gap-8 max-w-7xl w-full">
          
          {/* Left Side - ACTA Cards */}
          <div className="flex flex-col items-center space-y-6 w-64">
            <div className="text-center mb-4">
              <h3 className="text-2xl pixel-text text-amber-800 mb-2 neon-text-yellow">
                🎮 ACTA CARDS 🎮
              </h3>
              <p className="text-amber-700 text-sm animate-pulse">Choose Your Game Card</p>
            </div>
            
            {/* Cards Container */}
            <div className="space-y-4 flex flex-col items-center">
              {availableCards.map((card, index) => (
                <div key={card.id} className="relative">
                  <ActaCard
                    id={card.id}
                    isInserted={insertedCardId === card.id}
                    onCardMove={handleCardDrop}
                  />
                  {/* Card Labels */}
                  <div className="text-center mt-2">
                    <p className="text-xs pixel-text text-amber-800">
                      CARD #{(index + 1).toString().padStart(3, '0')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructional Arrow and Text */}
            <div className="flex flex-col items-center mt-8 animate-bounce">
              <div className="text-center mb-3">
                <p className="text-sm pixel-text text-amber-800">DRAG CARD</p>
                <p className="text-xs text-amber-600">TO COIN SLOT</p>
              </div>
              <div className="text-6xl text-amber-600 animate-pulse">
                ➡️
              </div>
            </div>
          </div>

          {/* Center - Retro Computer with Card Slot */}
          <div className="relative flex flex-col items-center">
            
            {/* Highlighted Card Slot - Gaming Style */}
            <div className="mb-4 relative">
              {/* Slot Container with Gaming Effects */}
              <div className={`relative p-6 rounded-2xl border-4 transition-all duration-300 ${
                cardInserted 
                  ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-400/50' 
                  : 'border-yellow-400 bg-yellow-900/20 shadow-lg shadow-yellow-400/50 animate-pulse'
              }`}>
                
                {/* Neon Border Effect */}
                <div className={`absolute inset-0 rounded-2xl ${
                  cardInserted ? 'neon-border-green' : 'neon-border-yellow'
                }`}></div>
                
                {/* Status Indicator */}
                <div className="text-center mb-4">
                  <div className={`flex items-center justify-center gap-2 pixel-text ${
                    cardInserted ? 'text-green-400 neon-text-cyan' : 'text-yellow-400 neon-text-yellow'
                  }`}>
                    {cardInserted ? (
                      <>
                        <Unlock className="h-6 w-6 animate-pulse" />
                        <span className="text-lg">AUTHENTICATED</span>
                        <Unlock className="h-6 w-6 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Lock className="h-6 w-6 animate-bounce" />
                        <span className="text-lg">INSERT COIN</span>
                        <Lock className="h-6 w-6 animate-bounce" />
                      </>
                    )}
                  </div>
                </div>

                {/* The Actual Card Slot - Highlighted like a Coin Slot */}
                <div className="relative">
                  <CardSlot onCardDrop={handleCardDrop} hasCard={cardInserted} />
                  
                  {/* Coin Slot Style Enhancements */}
                  {!cardInserted && (
                    <>
                      {/* Glowing Border */}
                      <div className="absolute inset-0 border-4 border-yellow-300 rounded-lg animate-pulse opacity-60"></div>
                      {/* Slot Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent rounded-lg animate-pulse"></div>
                      {/* Directional Arrows */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">
                        <div className="text-2xl">⬇️</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Remove Card Button */}
                {cardInserted && (
                  <div className="text-center mt-4">
                    <Button
                      onClick={handleCardRemove}
                      variant="outline"
                      size="sm"
                      className="pixel-text text-xs border-green-400 text-green-400 hover:bg-green-900/30 neon-button-cyan"
                    >
                      EJECT CARD
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Computer Frame */}
            <div 
              className="relative w-[700px] h-[500px] bg-cover bg-center retro-computer-container"
              style={{ backgroundImage: `url(${retroComputerImage})` }}
            >
              {/* Computer Screen */}
              <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[15%] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg border-4 border-gray-600 shadow-inner">
                
                {/* Screen Lock Overlay - Only shows "START GAME" when locked */}
                {!cardInserted && (
                  <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center z-20 screen-locked">
                    <div className="text-center">
                      <div className="mb-8">
                        <Lock className="h-20 w-20 mx-auto mb-4 text-red-400 animate-pulse" />
                        <div className="text-3xl pixel-text text-red-400 neon-text-magenta mb-2">
                          SYSTEM LOCKED
                        </div>
                        <div className="text-lg pixel-text text-yellow-400 animate-blink">
                          INSERT ACTA CARD
                        </div>
                      </div>
                      
                      {/* Fake START GAME button that doesn't work */}
                      <Button
                        disabled
                        className="bg-gray-600 text-gray-400 px-8 py-3 text-lg pixel-text uppercase tracking-wider border-2 border-gray-500 cursor-not-allowed opacity-50"
                      >
                        🔒 START GAME
                      </Button>
                      
                      <div className="mt-4 text-xs text-gray-500 pixel-text">
                        CARD REQUIRED TO PLAY
                      </div>
                    </div>
                  </div>
                )}

                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20 pointer-events-none"></div>
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)'
                  }}
                ></div>

                {/* Screen Content - Only visible when card is inserted */}
                {cardInserted && (
                  <div className="relative z-10 h-full flex flex-col text-green-400 font-mono">
                    {gameState === 'boot' && !isBooted ? (
                      // Boot Sequence
                      <div className="flex items-center justify-center h-full">
                        <div className="text-left w-full max-w-md auth-process p-8">
                          <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                            {bootText}
                            {showCursor && <span className="bg-green-400 text-blue-900">█</span>}
                          </pre>
                        </div>
                      </div>
                    ) : gameState === 'game-selection' ? (
                      // Game Selection Screen
                      <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="border-b-2 border-cyan-400 p-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
                          <h1 className="text-center text-2xl pixel-text neon-text-cyan mb-2">
                            🎮 GAME ARCADE 🎮
                          </h1>
                          <p className="text-center text-sm text-purple-300 animate-pulse">
                            ★ SELECT YOUR GAME ★
                          </p>
                        </div>

                        {/* Games Grid */}
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4 h-full">
                            {availableGames.map((game, index) => (
                              <div
                                key={game.id}
                                onClick={() => handleGameSelect(game.id)}
                                className={`relative cursor-pointer transition-all duration-300 border-2 rounded-lg p-4 hover:scale-105 ${
                                  index % 2 === 0 
                                    ? 'border-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40 neon-border-cyan' 
                                    : 'border-purple-400 bg-purple-900/20 hover:bg-purple-900/40 neon-border-magenta'
                                }`}
                              >
                                {/* Game Icon */}
                                <div className="text-center mb-3">
                                  <div className="text-4xl mb-2">{game.emoji}</div>
                                  <h3 className={`text-lg pixel-text ${
                                    index % 2 === 0 ? 'neon-text-cyan' : 'neon-text-magenta'
                                  }`}>
                                    {game.title}
                                  </h3>
                                </div>

                                {/* Game Info */}
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-300">DIFFICULTY:</span>
                                    <span className={
                                      game.difficulty === 'EASY' ? 'text-green-400' :
                                      game.difficulty === 'MEDIUM' ? 'text-yellow-400' : 
                                      'text-red-400'
                                    }>
                                      {game.difficulty}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-300">TIME:</span>
                                    <span className="text-blue-400">{game.time}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-300">REWARD:</span>
                                    <span className="text-yellow-400">{game.points}</span>
                                  </div>
                                </div>

                                {/* Game Description */}
                                <div className="mt-3 pt-2 border-t border-gray-600">
                                  <p className="text-xs text-gray-400 text-center">
                                    {game.description}
                                  </p>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-cyan-400 p-3 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-cyan-400">◀ ▶ Navigate</span>
                            <span className="text-purple-400">ENTER Select</span>
                            <span className="text-green-400">Credits: ∞</span>
                          </div>
                        </div>
                      </div>
                    ) : gameState === 'playing' && selectedGameId ? (
                      // Game Playing Screen
                      <div className="h-full">
                        {selectedGameId === 1 && <SnakeGame onBack={handleBackToGameSelection} />}
                        {selectedGameId === 2 && <PongGame onBack={handleBackToGameSelection} />}
                        {selectedGameId === 3 && (
                          <div className="h-full flex items-center justify-center text-center">
                            <div>
                              <h2 className="text-2xl pixel-text neon-text-cyan mb-4">🧩 TETRIS</h2>
                              <p className="mb-4">Coming Soon!</p>
                              <Button onClick={handleBackToGameSelection} className="neon-button-cyan pixel-text">
                                ← BACK TO GAMES
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedGameId === 4 && (
                          <div className="h-full flex items-center justify-center text-center">
                            <div>
                              <h2 className="text-2xl pixel-text neon-text-cyan mb-4">👻 PACMAN</h2>
                              <p className="mb-4">Coming Soon!</p>
                              <Button onClick={handleBackToGameSelection} className="neon-button-cyan pixel-text">
                                ← BACK TO GAMES
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedGameId === 5 && (
                          <div className="h-full flex items-center justify-center text-center">
                            <div>
                              <h2 className="text-2xl pixel-text neon-text-cyan mb-4">🚀 SPACE INVADERS</h2>
                              <p className="mb-4">Coming Soon!</p>
                              <Button onClick={handleBackToGameSelection} className="neon-button-cyan pixel-text">
                                ← BACK TO GAMES
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedGameId === 6 && (
                          <div className="h-full flex items-center justify-center text-center">
                            <div>
                              <h2 className="text-2xl pixel-text neon-text-cyan mb-4">🐸 FROGGER</h2>
                              <p className="mb-4">Coming Soon!</p>
                              <Button onClick={handleBackToGameSelection} className="neon-button-cyan pixel-text">
                                ← BACK TO GAMES
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* CRT Glow Effect */}
                <div className="absolute inset-0 bg-green-400/5 rounded-lg pointer-events-none computer-screen-glow"></div>
              </div>

              {/* Power Button with Dynamic State */}
              <div className={`absolute bottom-[8%] right-[15%] w-5 h-5 rounded-full border-2 border-gray-700 shadow-md transition-all duration-500 ${
                cardInserted ? 'power-button-unlocked' : 'power-button-locked'
              }`}></div>
            </div>

            {/* Desk Shadow */}
            <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 rounded-full blur-lg"></div>
          </div>

          {/* Right Side - Game Instructions */}
          <div className="flex flex-col items-center space-y-4 w-64">
            <div className="text-center p-6 instruction-panel">
              <h3 className="text-lg pixel-text text-amber-800 mb-4 neon-text-yellow">
                🕹️ GAME RULES 🕹️
              </h3>
              <div className="space-y-3 text-sm text-amber-700 text-left">
                <div className="flex items-start space-x-2">
                  <span className="text-amber-500 pixel-text">1.</span>
                  <span>Select ACTA Card from left panel</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-amber-500 pixel-text">2.</span>
                  <span>Drag card to the glowing coin slot</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-amber-500 pixel-text">3.</span>
                  <span>Wait for system authentication</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-amber-500 pixel-text">4.</span>
                  <span>Hit PLAY NOW to start gaming!</span>
                </div>
              </div>
            </div>

            {/* Gaming Stats */}
            <div className="text-center p-4 bg-amber-900/20 rounded-lg border border-amber-600">
              <h4 className="pixel-text text-amber-300 mb-2">ARCADE STATS</h4>
              <div className="space-y-1 text-xs text-amber-200">
                <p>🏆 HIGH SCORE: ∞</p>
                <p>🎯 ACCURACY: 100%</p>
                <p>⚡ POWER LEVEL: MAX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}