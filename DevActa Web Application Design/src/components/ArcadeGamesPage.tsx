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

const PACMAN_ROWS = 15;
const PACMAN_COLS = 15;

const INITIAL_PACMAN_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,4,1,1,1,1,1,1,1,1,1,1,1,4,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const INITIAL_PACMAN_POS = { x: 1, y: 1 };
const INITIAL_GHOSTS = [
  { x: 1, y: 13, color: 'red', speed: 1 },
  { x: 13, y: 13, color: 'pink', speed: 1 },
  { x: 1, y: 7, color: 'cyan', speed: 1 },
  { x: 13, y: 7, color: 'orange', speed: 1 },
];

// Pinball game constants
const PINBALL_WIDTH = 400;
const PINBALL_HEIGHT = 600;
const PINBALL_BALL_RADIUS = 10;
const PINBALL_FLIPPER_LENGTH = 80;

const PINBALL_BUMPERS = [
  { x: 120, y: 150, r: 20, score: 15 },
  { x: 280, y: 200, r: 20, score: 15 },
  { x: 200, y: 100, r: 22, score: 25 },
];

// Breakout game constants - MUCH BIGGER SCREEN
const BREAKOUT_WIDTH = 600;
const BREAKOUT_HEIGHT = 800;
const BREAKOUT_PADDLE_WIDTH = 120;
const BREAKOUT_PADDLE_HEIGHT = 18;
const BREAKOUT_BALL_RADIUS = 15;
const BREAKOUT_BRICK_ROWS = 6;
const BREAKOUT_BRICK_COLS = 10;
const BREAKOUT_BRICK_WIDTH = 55;
const BREAKOUT_BRICK_HEIGHT = 25;
const BREAKOUT_BRICK_PADDING = 5;

// Flappy Bird game constants
const FLAPPY_WIDTH = 600;
const FLAPPY_HEIGHT = 800;
const FLAPPY_BIRD_SIZE = 40;
const FLAPPY_GRAVITY = 0.4; // Reduced gravity for easier control
const FLAPPY_JUMP = -10; // Adjusted jump to match new gravity
const FLAPPY_PIPE_WIDTH = 80;
const FLAPPY_PIPE_GAP = 220; // Increased gap for easier gameplay
const FLAPPY_PIPE_SPEED = 3;

// Car Race game constants
const CAR_WIDTH = 600;
const CAR_HEIGHT = 800;
const CAR_PLAYER_WIDTH = 60;
const CAR_PLAYER_HEIGHT = 100;
const CAR_OBSTACLE_WIDTH = 60;
const CAR_OBSTACLE_HEIGHT = 100;
const CAR_OBSTACLE_SPEED = 7;
const CAR_LANE_WIDTH = 120;
const CAR_NUM_LANES = 4;
const CAR_ROAD_WIDTH = CAR_LANE_WIDTH * CAR_NUM_LANES;

// Pong game constants
const PONG_WIDTH = 700;
const PONG_HEIGHT = 500;
const PONG_PADDLE_WIDTH = 15;
const PONG_PADDLE_HEIGHT = 120;
const PONG_BALL_SIZE = 18;
const PONG_BALL_SPEED = 8; // Increased speed for faster gameplay
const PONG_AI_SPEED = 5;

// Space Shooter game constants
const SPACE_WIDTH = 700;
const SPACE_HEIGHT = 800;
const SPACE_PLAYER_WIDTH = 60;
const SPACE_PLAYER_HEIGHT = 60;
const SPACE_PLAYER_SPEED = 8;
const SPACE_BULLET_WIDTH = 6;
const SPACE_BULLET_HEIGHT = 20;
const SPACE_BULLET_SPEED = 10;
const SPACE_ENEMY_WIDTH = 50;
const SPACE_ENEMY_HEIGHT = 50;
const SPACE_ENEMY_SPEED = 2;

interface ArcadeGamesPageProps {
  onGameSelect?: (gameId: number, gameTitle: string) => void;
}

export function ArcadeGamesPage({ onGameSelect }: ArcadeGamesPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coins, setCoins] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<'snake' | 'tetris' | 'pac-man' | 'pinball' | 'breakout' | 'flappy' | 'car-race' | 'pong' | 'space-shooter'>('snake');
  
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
  const [level, setLevel] = useState(1);
  const [pelletsCollected, setPelletsCollected] = useState(0);
  
  // Pinball game state
  const [pinballBall, setPinballBall] = useState({ x: PINBALL_WIDTH / 2, y: PINBALL_HEIGHT - 80, vx: 0, vy: 0 });
  const [leftFlipper, setLeftFlipper] = useState(false);
  const [rightFlipper, setRightFlipper] = useState(false);
  const pinballCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Breakout game state
  const [breakoutPaddleX, setBreakoutPaddleX] = useState(BREAKOUT_WIDTH / 2 - BREAKOUT_PADDLE_WIDTH / 2);
  const [breakoutBall, setBreakoutBall] = useState({ x: BREAKOUT_WIDTH / 2, y: BREAKOUT_HEIGHT - 100, dx: 6, dy: -6 });
  const [breakoutBricks, setBreakoutBricks] = useState<Array<{x: number, y: number, status: boolean}>>([]);
  const breakoutCanvasRef = useRef<HTMLCanvasElement>(null);
  const breakoutBallRef = useRef(breakoutBall);
  const breakoutBricksRef = useRef(breakoutBricks);
  const breakoutPaddleXRef = useRef(breakoutPaddleX);
  
  // Flappy Bird game state
  const [flappyBird, setFlappyBird] = useState({ x: 100, y: FLAPPY_HEIGHT / 2, vy: 0 });
  const [flappyPipes, setFlappyPipes] = useState<Array<{x: number, y: number}>>([]);
  const flappyCanvasRef = useRef<HTMLCanvasElement>(null);
  const flappyBirdRef = useRef(flappyBird);
  const flappyPipesRef = useRef(flappyPipes);
  
  // Car Race game state
  const [carPlayer, setCarPlayer] = useState({ x: CAR_WIDTH / 2 - CAR_PLAYER_WIDTH / 2, y: CAR_HEIGHT - CAR_PLAYER_HEIGHT - 20 });
  const [carObstacles, setCarObstacles] = useState<Array<{x: number, y: number}>>([]);
  const [carRoadOffset, setCarRoadOffset] = useState(0);
  const carCanvasRef = useRef<HTMLCanvasElement>(null);
  const carPlayerRef = useRef(carPlayer);
  const carObstaclesRef = useRef(carObstacles);
  
  // Pong game state
  const [pongBall, setPongBall] = useState({ x: PONG_WIDTH / 2, y: PONG_HEIGHT / 2, dx: PONG_BALL_SPEED, dy: PONG_BALL_SPEED });
  const [pongPlayerPaddleY, setPongPlayerPaddleY] = useState(PONG_HEIGHT / 2 - PONG_PADDLE_HEIGHT / 2);
  const [pongAiPaddleY, setPongAiPaddleY] = useState(PONG_HEIGHT / 2 - PONG_PADDLE_HEIGHT / 2);
  const [pongPlayerScore, setPongPlayerScore] = useState(0);
  const [pongAiScore, setPongAiScore] = useState(0);
  const pongCanvasRef = useRef<HTMLCanvasElement>(null);
  const pongBallRef = useRef(pongBall);
  const pongPlayerPaddleYRef = useRef(pongPlayerPaddleY);
  const pongAiPaddleYRef = useRef(pongAiPaddleY);
  
  // Space Shooter game state
  const [spacePlayer, setSpacePlayer] = useState({ x: SPACE_WIDTH / 2 - SPACE_PLAYER_WIDTH / 2, y: SPACE_HEIGHT - SPACE_PLAYER_HEIGHT - 20 });
  const [spaceBullets, setSpaceBullets] = useState<Array<{x: number, y: number}>>([]);
  const [spaceEnemies, setSpaceEnemies] = useState<Array<{x: number, y: number}>>([]);
  const [spaceKeys, setSpaceKeys] = useState({ left: false, right: false, shoot: false });
  const [spaceStars, setSpaceStars] = useState<Array<{x: number, y: number, speed: number}>>([]);
  const spaceCanvasRef = useRef<HTMLCanvasElement>(null);
  const spacePlayerRef = useRef(spacePlayer);
  const spaceBulletsRef = useRef(spaceBullets);
  const spaceEnemiesRef = useRef(spaceEnemies);
  const spaceKeysRef = useRef(spaceKeys);
  
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
        
        // Award 3 trophies after 1 minute (60 seconds)
        if (newTime === 60 && trophiesEarned === 0) {
          setTrophiesEarned(3);
          setShowTrophyNotification(true);
          // Hide notification after 5 seconds
          setTimeout(() => setShowTrophyNotification(false), 5000);
          
          // End Flappy Bird and Car Race games after 1 minute
          if (currentGameType === 'flappy' || currentGameType === 'car-race') {
            setGameOver(true);
          }
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
      let newScore = score;
      let newPelletsCollected = pelletsCollected;
      
      if (pacmanMap[ny][nx] === PACMAN_PELLET) {
        newScore += 10;
        newPelletsCollected += 1;
        
        // Check if level complete (all pellets collected)
        const totalPellets = pacmanMap.flat().filter(cell => cell === PACMAN_PELLET).length;
        if (totalPellets <= 1) { // Only the one we just collected
          setLevel(prev => prev + 1);
          setPelletsCollected(0);
          // Reset map with more walls and enemies
          const newMap = INITIAL_PACMAN_MAP.map(row => [...row]);
          // Add more walls randomly
          for (let i = 0; i < level * 5; i++) {
            const x = Math.floor(Math.random() * PACMAN_COLS);
            const y = Math.floor(Math.random() * PACMAN_ROWS);
            if (newMap[y][x] === PACMAN_PELLET) {
              newMap[y][x] = PACMAN_WALL;
            }
          }
          setPacmanMap(newMap);
          setPacmanPos(INITIAL_PACMAN_POS);
          // Add more ghosts
          const newGhosts = [...INITIAL_GHOSTS];
          for (let i = 0; i < level; i++) {
            newGhosts.push({
              x: Math.floor(Math.random() * PACMAN_COLS),
              y: Math.floor(Math.random() * PACMAN_ROWS),
              color: ['red', 'pink', 'cyan', 'orange'][i % 4],
              speed: 1 + level * 0.2
            });
          }
          setGhosts(newGhosts);
          return;
        }
      }
      
      const newMap = pacmanMap.map(row => [...row]);
      newMap[pacmanPos.y][pacmanPos.x] = PACMAN_EMPTY;
      newMap[ny][nx] = PACMAN_PLAYER;
      setPacmanMap(newMap);
      setPacmanPos({ x: nx, y: ny });
      setScore(newScore);
      setPelletsCollected(newPelletsCollected);

      // Check collisions with ghosts
      ghosts.forEach(g => {
        if (g.x === nx && g.y === ny) setGameOver(true);
      });
    }
  };

  const pacmanMoveGhosts = () => {
    if (gameOver) return;
    
    const newGhosts = ghosts.map(g => {
      // More aggressive AI - try to move towards Pac-Man
      const directions = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
      ];
      
      // Calculate distance to Pac-Man for each direction
      const movesWithDistance = directions.map(({ dx, dy }) => {
        const nx = g.x + dx;
        const ny = g.y + dy;
        const distance = Math.abs(nx - pacmanPos.x) + Math.abs(ny - pacmanPos.y);
        return { dx, dy, distance, nx, ny };
      });
      
      // Filter valid moves (not walls)
      const validMoves = movesWithDistance.filter(({ nx, ny }) => 
        pacmanMap[ny] && pacmanMap[ny][nx] !== PACMAN_WALL
      );
      
      if (validMoves.length === 0) return g;
      
      // Choose move that gets closer to Pac-Man (more aggressive)
      const bestMove = validMoves.reduce((best, current) => 
        current.distance < best.distance ? current : best
      );
      
      // Sometimes move randomly to make it less predictable
      const move = Math.random() < 0.3 ? 
        validMoves[Math.floor(Math.random() * validMoves.length)] : 
        bestMove;
      
      return { ...g, x: move.nx, y: move.ny };
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
    }, Math.max(200, 500 - level * 50)); // Faster ghosts as level increases

    return () => clearInterval(ghostInterval);
  }, [isPlaying, gameOver, currentGameType, pacmanPos, ghosts, pacmanMap, level]);

  // Pinball helper functions
  const pinballDraw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, PINBALL_WIDTH, PINBALL_HEIGHT);
    
    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, PINBALL_HEIGHT);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, PINBALL_WIDTH, PINBALL_HEIGHT);
    
    // Draw ball with glow effect
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(pinballBall.x, pinballBall.y, PINBALL_BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw bumpers with glow and animation
    PINBALL_BUMPERS.forEach((b, index) => {
      const time = Date.now() * 0.01;
      const pulse = Math.sin(time + index) * 0.1 + 1;
      const radius = b.r * pulse;
      
      ctx.shadowColor = "#FF0000";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#FF0000";
      ctx.fill();
      ctx.strokeStyle = "#FF6666";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.closePath();
      ctx.shadowBlur = 0;
    });

    // Draw flippers with better animation
    const flipperY = PINBALL_HEIGHT - 30;
    const leftFlipperX = PINBALL_WIDTH / 2 - 60;
    const rightFlipperX = PINBALL_WIDTH / 2 + 60;
    
    // Left flipper
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(leftFlipperX, flipperY);
    ctx.lineTo(leftFlipperX + (leftFlipper ? 50 : 20), flipperY - (leftFlipper ? 30 : 10));
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Right flipper
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(rightFlipperX, flipperY);
    ctx.lineTo(rightFlipperX - (rightFlipper ? 50 : 20), flipperY - (rightFlipper ? 30 : 10));
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw walls with neon effect
    ctx.shadowColor = "#4169E1";
    ctx.shadowBlur = 5;
    ctx.strokeStyle = "#4169E1";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(PINBALL_WIDTH, 0);
    ctx.lineTo(PINBALL_WIDTH, PINBALL_HEIGHT);
    ctx.lineTo(0, PINBALL_HEIGHT);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw side walls to prevent ball from falling down sides
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 3;
    
    // Left side wall
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(30, flipperY - 20);
    ctx.stroke();
    ctx.closePath();
    
    // Right side wall
    ctx.beginPath();
    ctx.moveTo(PINBALL_WIDTH - 30, 0);
    ctx.lineTo(PINBALL_WIDTH - 30, flipperY - 20);
    ctx.stroke();
    ctx.closePath();
    
    // Draw center gap boundaries (invisible guides)
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 2;
    
    // Left boundary of center gap
    ctx.beginPath();
    ctx.moveTo(leftFlipperX + 35, flipperY - 15);
    ctx.lineTo(leftFlipperX + 35, PINBALL_HEIGHT);
    ctx.stroke();
    ctx.closePath();
    
    // Right boundary of center gap
    ctx.beginPath();
    ctx.moveTo(rightFlipperX - 35, flipperY - 15);
    ctx.lineTo(rightFlipperX - 35, PINBALL_HEIGHT);
    ctx.stroke();
    ctx.closePath();
    
    ctx.shadowBlur = 0;

    // Draw center line
    ctx.strokeStyle = "#4169E1";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PINBALL_WIDTH / 2, 0);
    ctx.lineTo(PINBALL_WIDTH / 2, PINBALL_HEIGHT - 50);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);

    // Score display with better styling
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeText("Score: " + score, 15, 35);
    ctx.fillText("Score: " + score, 15, 35);
  };

  const pinballUpdate = () => {
    let newBall = { ...pinballBall };

    // Stronger gravity for faster gameplay
    newBall.vy += 0.6;

    // Update position
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Better wall collisions with stronger bouncing
    if (newBall.x - PINBALL_BALL_RADIUS <= 0) {
      newBall.x = PINBALL_BALL_RADIUS;
      newBall.vx = Math.abs(newBall.vx) * 0.9;
    }
    if (newBall.x + PINBALL_BALL_RADIUS >= PINBALL_WIDTH) {
      newBall.x = PINBALL_WIDTH - PINBALL_BALL_RADIUS;
      newBall.vx = -Math.abs(newBall.vx) * 0.9;
    }
    if (newBall.y - PINBALL_BALL_RADIUS <= 0) {
      newBall.y = PINBALL_BALL_RADIUS;
      newBall.vy = Math.abs(newBall.vy) * 0.9;
    }

    // IMPROVED side walls - ball NEVER falls from sides of flippers
    const flipperY = PINBALL_HEIGHT - 30;
    const leftFlipperX = PINBALL_WIDTH / 2 - 60;
    const rightFlipperX = PINBALL_WIDTH / 2 + 60;
    
    // Side walls above flippers - prevent ball from going to sides
    if (newBall.y < flipperY - 20) {
      if (newBall.x < 30) {
        newBall.x = 30;
        newBall.vx = Math.abs(newBall.vx) * 0.9;
      }
      if (newBall.x > PINBALL_WIDTH - 30) {
        newBall.x = PINBALL_WIDTH - 30;
        newBall.vx = -Math.abs(newBall.vx) * 0.9;
      }
    }
    
    // CRITICAL: Prevent ball from falling down sides of flippers
    if (newBall.y > flipperY - 15) {
      // Define the center gap where ball can fall (between flippers)
      const centerGapStart = leftFlipperX + 35; // Start of center gap
      const centerGapEnd = rightFlipperX - 35;   // End of center gap
      
      // If ball is trying to fall down the side, force it to center gap
      if (newBall.x < centerGapStart) {
        // Ball is too far left - push it to center gap
        newBall.x = centerGapStart;
        newBall.vx = Math.abs(newBall.vx) * 0.7; // Slow it down
        newBall.vy = Math.abs(newBall.vy) * 0.8; // Reduce downward speed
      } else if (newBall.x > centerGapEnd) {
        // Ball is too far right - push it to center gap
        newBall.x = centerGapEnd;
        newBall.vx = -Math.abs(newBall.vx) * 0.7; // Slow it down
        newBall.vy = Math.abs(newBall.vy) * 0.8; // Reduce downward speed
      }
    }

    // Much better flipper collision detection
    
    // Left flipper - MUCH stronger launch
    if (leftFlipper && 
        newBall.y + PINBALL_BALL_RADIUS >= flipperY - 15 &&
        newBall.y - PINBALL_BALL_RADIUS <= flipperY + 15 &&
        newBall.x >= leftFlipperX - 30 &&
        newBall.x <= leftFlipperX + 50) {
      // Strong upward launch - MUCH FASTER!
      newBall.vy = -25; // MUCH stronger upward force to reach top
      newBall.vx = -12; // Strong leftward force
      newBall.y = flipperY - PINBALL_BALL_RADIUS - 10;
      setScore(prev => prev + 5); // Bonus for flipper hit
    }
    
    // Right flipper - MUCH stronger launch
    if (rightFlipper && 
        newBall.y + PINBALL_BALL_RADIUS >= flipperY - 15 &&
        newBall.y - PINBALL_BALL_RADIUS <= flipperY + 15 &&
        newBall.x >= rightFlipperX - 50 &&
        newBall.x <= rightFlipperX + 30) {
      // Strong upward launch - MUCH FASTER!
      newBall.vy = -25; // MUCH stronger upward force to reach top
      newBall.vx = 12; // Strong rightward force
      newBall.y = flipperY - PINBALL_BALL_RADIUS - 10;
      setScore(prev => prev + 5); // Bonus for flipper hit
    }

    // Much better bumper collisions - ball goes UP when hit!
    PINBALL_BUMPERS.forEach(b => {
      const dx = newBall.x - b.x;
      const dy = newBall.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const collisionDist = PINBALL_BALL_RADIUS + b.r;
      
      if (dist < collisionDist) {
        // Calculate collision normal
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Move ball out of bumper
        const overlap = collisionDist - dist;
        newBall.x += nx * overlap;
        newBall.y += ny * overlap;
        
        // FORCE ball to go UP when hitting bumper - MUCH FASTER!
        // Calculate upward direction (negative Y)
        const upwardForce = 25; // MUCH stronger upward force to reach top
        const sidewaysForce = 10; // Stronger sideways force
        
        // Always push ball upward with some sideways variation
        newBall.vy = -upwardForce; // Always negative (upward) - FAST!
        newBall.vx = (Math.random() - 0.5) * sidewaysForce; // Random sideways
        
        // Add extra energy boost
        newBall.vx *= 1.5;
        newBall.vy *= 1.5;
        
        setScore(prev => prev + b.score);
      }
    });

    // Ball out of bounds - GAME OVER when ball falls through center gap
    if (newBall.y > PINBALL_HEIGHT + 50) {
      // Game ends when ball falls through center gap
      setGameOver(true);
      return; // Don't reset ball, game is over
    }

    // Less friction for faster gameplay
    newBall.vx *= 0.998;
    newBall.vy *= 0.998;

    setPinballBall(newBall);

    if (pinballCanvasRef.current) {
      const ctx = pinballCanvasRef.current.getContext("2d");
      if (ctx) pinballDraw(ctx);
    }
  };

  // Pinball game logic
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'pinball') return;

    // Initialize canvas
    if (pinballCanvasRef.current) {
      const ctx = pinballCanvasRef.current.getContext("2d");
      if (ctx) pinballDraw(ctx);
    }

    const pinballInterval = setInterval(() => {
      pinballUpdate();
    }, 20);

    return () => clearInterval(pinballInterval);
  }, [isPlaying, gameOver, currentGameType, pinballBall, leftFlipper, rightFlipper]);

  const navigateLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockGames.length - 1 : prev - 1));
  };

  const navigateRight = () => {
    setCurrentIndex((prev) => (prev === mockGames.length - 1 ? 0 : prev + 1));
  };

  const handleSelectGame = () => {
    if (coins > 0) {
      const currentGame = mockGames[currentIndex];
      const gameType = currentGame.title.toLowerCase().replace(/\s+/g, '-');
      
      setCoins(coins - 1);
      setIsPlaying(true);
      setGameOver(false);
      setScore(0);
      setPlayTime(0);
      setCurrentGameType(gameType as 'snake' | 'tetris' | 'pac-man' | 'pinball' | 'breakout' | 'flappy' | 'car-race' | 'pong');
      
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
        setLevel(1);
        setPelletsCollected(0);
      } else if (gameType === 'pinball') {
        setPinballBall({ 
          x: PINBALL_WIDTH / 2, 
          y: PINBALL_HEIGHT - 80, 
          vx: (Math.random() - 0.5) * 8, 
          vy: -15 
        });
        setLeftFlipper(false);
        setRightFlipper(false);
      } else if (gameType === 'breakout') {
        setBreakoutPaddleX(BREAKOUT_WIDTH / 2 - BREAKOUT_PADDLE_WIDTH / 2);
        setBreakoutBall({ x: BREAKOUT_WIDTH / 2, y: BREAKOUT_HEIGHT - 120, dx: 7, dy: -7 });
        setBreakoutBricks([]);
      } else if (gameType === 'flappy') {
        setFlappyBird({ x: 100, y: FLAPPY_HEIGHT / 2, vy: 0 });
        setFlappyPipes([]);
      } else if (gameType === 'car-race') {
        const roadStartX = (CAR_WIDTH - CAR_ROAD_WIDTH) / 2;
        const startLane = 1; // Start in second lane
        const startX = roadStartX + (startLane * CAR_LANE_WIDTH) + (CAR_LANE_WIDTH - CAR_PLAYER_WIDTH) / 2;
        setCarPlayer({ x: startX, y: CAR_HEIGHT - CAR_PLAYER_HEIGHT - 30 });
        setCarObstacles([]);
        setCarRoadOffset(0);
      } else if (gameType === 'pong') {
        setPongBall({ x: PONG_WIDTH / 2, y: PONG_HEIGHT / 2, dx: PONG_BALL_SPEED, dy: PONG_BALL_SPEED });
        setPongPlayerPaddleY(PONG_HEIGHT / 2 - PONG_PADDLE_HEIGHT / 2);
        setPongAiPaddleY(PONG_HEIGHT / 2 - PONG_PADDLE_HEIGHT / 2);
        setPongPlayerScore(0);
        setPongAiScore(0);
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
        } else if (currentGameType === 'pinball') {
          // Pinball controls
          if (e.key === "ArrowLeft") {
            setLeftFlipper(true);
          } else if (e.key === "ArrowRight") {
            setRightFlipper(true);
          } else if (e.key === " ") {
            // Space bar to launch ball - MUCH STRONGER LAUNCH
            if (pinballBall.vx === 0 && pinballBall.vy === 0) {
              setPinballBall(prev => ({
                ...prev,
                vx: (Math.random() - 0.5) * 12,
                vy: -18
              }));
            }
          }
        } else if (currentGameType === 'breakout') {
          // Breakout controls handled by mouse
        } else if (currentGameType === 'car-race') {
          // Car Race controls - move between lanes
          const roadStartX = (CAR_WIDTH - CAR_ROAD_WIDTH) / 2;
          const roadEndX = roadStartX + CAR_ROAD_WIDTH;
          
          if (e.key === "ArrowLeft") {
            setCarPlayer(prev => {
              let newX = prev.x - CAR_LANE_WIDTH;
              // Keep within road bounds
              if (newX < roadStartX) newX = roadStartX + (CAR_LANE_WIDTH - CAR_PLAYER_WIDTH) / 2;
              return { ...prev, x: newX };
            });
          } else if (e.key === "ArrowRight") {
            setCarPlayer(prev => {
              let newX = prev.x + CAR_LANE_WIDTH;
              // Keep within road bounds
              if (newX + CAR_PLAYER_WIDTH > roadEndX) {
                const lastLane = CAR_NUM_LANES - 1;
                newX = roadStartX + (lastLane * CAR_LANE_WIDTH) + (CAR_LANE_WIDTH - CAR_PLAYER_WIDTH) / 2;
              }
              return { ...prev, x: newX };
            });
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

  // Pinball flipper release with better timing
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isPlaying && currentGameType === 'pinball') {
        if (e.key === "ArrowLeft") {
          setTimeout(() => setLeftFlipper(false), 50); // Faster release
        } else if (e.key === "ArrowRight") {
          setTimeout(() => setRightFlipper(false), 50); // Faster release
        }
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying, currentGameType]);

  // Update Breakout refs when state changes
  useEffect(() => {
    breakoutBallRef.current = breakoutBall;
  }, [breakoutBall]);

  useEffect(() => {
    breakoutBricksRef.current = breakoutBricks;
  }, [breakoutBricks]);

  useEffect(() => {
    breakoutPaddleXRef.current = breakoutPaddleX;
  }, [breakoutPaddleX]);

  // Breakout game logic
  const initializeBreakoutBricks = () => {
    const tempBricks: Array<{x: number, y: number, status: boolean}> = [];
    for (let r = 0; r < BREAKOUT_BRICK_ROWS; r++) {
      for (let c = 0; c < BREAKOUT_BRICK_COLS; c++) {
        tempBricks.push({
          x: c * (BREAKOUT_BRICK_WIDTH + BREAKOUT_BRICK_PADDING) + 25,
          y: r * (BREAKOUT_BRICK_HEIGHT + BREAKOUT_BRICK_PADDING) + 50,
          status: true,
        });
      }
    }
    setBreakoutBricks(tempBricks);
  };

  const breakoutDraw = (ctx: CanvasRenderingContext2D) => {
    const ball = breakoutBallRef.current;
    const bricks = breakoutBricksRef.current;
    const paddleX = breakoutPaddleXRef.current;
    
    ctx.clearRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT);
    
    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, BREAKOUT_HEIGHT);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT);

    // Draw ball with enhanced glow
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BREAKOUT_BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw paddle with enhanced glow
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#00FFFF";
    ctx.fillRect(paddleX, BREAKOUT_HEIGHT - BREAKOUT_PADDLE_HEIGHT - 20, BREAKOUT_PADDLE_WIDTH, BREAKOUT_PADDLE_HEIGHT);
    ctx.strokeStyle = "#00AAAA";
    ctx.lineWidth = 2;
    ctx.strokeRect(paddleX, BREAKOUT_HEIGHT - BREAKOUT_PADDLE_HEIGHT - 20, BREAKOUT_PADDLE_WIDTH, BREAKOUT_PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    // Draw bricks with enhanced effects
    bricks.forEach((brick) => {
      if (brick.status) {
        ctx.shadowColor = "#FF0000";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(brick.x, brick.y, BREAKOUT_BRICK_WIDTH, BREAKOUT_BRICK_HEIGHT);
        ctx.strokeStyle = "#FF6666";
        ctx.lineWidth = 3;
        ctx.strokeRect(brick.x, brick.y, BREAKOUT_BRICK_WIDTH, BREAKOUT_BRICK_HEIGHT);
        ctx.shadowBlur = 0;
      }
    });

    // Draw score with better styling
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText("Score: " + score, 20, 50);
    ctx.fillText("Score: " + score, 20, 50);
  };

  const breakoutUpdate = () => {
    if (gameOver) return;

    let newBall = { ...breakoutBallRef.current };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Wall collisions - FIXED BOUNCING
    if (newBall.x + BREAKOUT_BALL_RADIUS >= BREAKOUT_WIDTH || newBall.x - BREAKOUT_BALL_RADIUS <= 0) {
      newBall.dx = -newBall.dx;
      // Keep ball in bounds
      if (newBall.x + BREAKOUT_BALL_RADIUS >= BREAKOUT_WIDTH) {
        newBall.x = BREAKOUT_WIDTH - BREAKOUT_BALL_RADIUS;
      }
      if (newBall.x - BREAKOUT_BALL_RADIUS <= 0) {
        newBall.x = BREAKOUT_BALL_RADIUS;
      }
    }
    
    if (newBall.y - BREAKOUT_BALL_RADIUS <= 0) {
      newBall.dy = -newBall.dy;
      newBall.y = BREAKOUT_BALL_RADIUS;
    }

    // Paddle collision - FIXED BOUNCING
    const paddleX = breakoutPaddleXRef.current;
    if (
      newBall.y + BREAKOUT_BALL_RADIUS >= BREAKOUT_HEIGHT - BREAKOUT_PADDLE_HEIGHT - 20 &&
      newBall.x >= paddleX &&
      newBall.x <= paddleX + BREAKOUT_PADDLE_WIDTH &&
      newBall.dy > 0 // Only bounce if ball is moving down
    ) {
      newBall.dy = -Math.abs(newBall.dy); // Always bounce up
      newBall.y = BREAKOUT_HEIGHT - BREAKOUT_PADDLE_HEIGHT - 20 - BREAKOUT_BALL_RADIUS;
      // Add some angle based on where ball hits paddle
      const hitPos = (newBall.x - paddleX) / BREAKOUT_PADDLE_WIDTH;
      newBall.dx = (hitPos - 0.5) * 12; // Stronger angle
    }

    // Brick collisions - FIXED BOUNCING
    let brickHit = false;
    const newBricks = breakoutBricksRef.current.map((brick) => {
      if (brick.status && !brickHit) {
        // More accurate collision detection
        const ballLeft = newBall.x - BREAKOUT_BALL_RADIUS;
        const ballRight = newBall.x + BREAKOUT_BALL_RADIUS;
        const ballTop = newBall.y - BREAKOUT_BALL_RADIUS;
        const ballBottom = newBall.y + BREAKOUT_BALL_RADIUS;
        
        const brickLeft = brick.x;
        const brickRight = brick.x + BREAKOUT_BRICK_WIDTH;
        const brickTop = brick.y;
        const brickBottom = brick.y + BREAKOUT_BRICK_HEIGHT;
        
        if (ballRight > brickLeft && ballLeft < brickRight && 
            ballBottom > brickTop && ballTop < brickBottom) {
          brickHit = true;
          setScore(prev => prev + 10);
          
          // Determine collision side and bounce accordingly
          const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
          const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);
          
          if (overlapX < overlapY) {
            // Hit from side
            newBall.dx = -newBall.dx;
          } else {
            // Hit from top/bottom
            newBall.dy = -newBall.dy;
          }
          
          return { ...brick, status: false };
        }
      }
      return brick;
    });

    setBreakoutBricks(newBricks);

    // Check game over - ball falls below paddle
    if (newBall.y + BREAKOUT_BALL_RADIUS > BREAKOUT_HEIGHT) {
      setGameOver(true);
      return;
    }

    setBreakoutBall(newBall);

    if (breakoutCanvasRef.current) {
      const ctx = breakoutCanvasRef.current.getContext("2d");
      if (ctx) breakoutDraw(ctx);
    }
  };

  // Breakout game logic
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'breakout') return;

    // Initialize bricks only once
    if (breakoutBricksRef.current.length === 0) {
      initializeBreakoutBricks();
    }

    // Initialize canvas
    if (breakoutCanvasRef.current) {
      const ctx = breakoutCanvasRef.current.getContext("2d");
      if (ctx) breakoutDraw(ctx);
    }

    const breakoutInterval = setInterval(() => {
      breakoutUpdate();
    }, 16);

    return () => clearInterval(breakoutInterval);
  }, [isPlaying, gameOver, currentGameType]);

  // Breakout mouse controls
  useEffect(() => {
    if (!isPlaying || currentGameType !== 'breakout') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (breakoutCanvasRef.current) {
        const rect = breakoutCanvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        let newX = mouseX - BREAKOUT_PADDLE_WIDTH / 2;
        if (newX < 0) newX = 0;
        if (newX + BREAKOUT_PADDLE_WIDTH > BREAKOUT_WIDTH) newX = BREAKOUT_WIDTH - BREAKOUT_PADDLE_WIDTH;
        setBreakoutPaddleX(newX);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isPlaying, currentGameType]);

  // Update Flappy refs when state changes
  useEffect(() => {
    flappyBirdRef.current = flappyBird;
  }, [flappyBird]);

  useEffect(() => {
    flappyPipesRef.current = flappyPipes;
  }, [flappyPipes]);

  // Flappy Bird game logic
  const flappyDraw = (ctx: CanvasRenderingContext2D) => {
    const bird = flappyBirdRef.current;
    const pipes = flappyPipesRef.current;
    
    ctx.clearRect(0, 0, FLAPPY_WIDTH, FLAPPY_HEIGHT);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, FLAPPY_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, FLAPPY_WIDTH, FLAPPY_HEIGHT);

    // Bird with glow
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bird.x, bird.y, FLAPPY_BIRD_SIZE, FLAPPY_BIRD_SIZE);
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 3;
    ctx.strokeRect(bird.x, bird.y, FLAPPY_BIRD_SIZE, FLAPPY_BIRD_SIZE);
    ctx.shadowBlur = 0;

    // Pipes with glow
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00AA00";
    pipes.forEach((p) => {
      // Top pipe
      ctx.fillRect(p.x, 0, FLAPPY_PIPE_WIDTH, p.y);
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x, 0, FLAPPY_PIPE_WIDTH, p.y);
      
      // Bottom pipe
      ctx.fillRect(p.x, p.y + FLAPPY_PIPE_GAP, FLAPPY_PIPE_WIDTH, FLAPPY_HEIGHT - p.y - FLAPPY_PIPE_GAP);
      ctx.strokeRect(p.x, p.y + FLAPPY_PIPE_GAP, FLAPPY_PIPE_WIDTH, FLAPPY_HEIGHT - p.y - FLAPPY_PIPE_GAP);
    });
    ctx.shadowBlur = 0;

    // Score
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText("Score: " + score, 20, 50);
    ctx.fillText("Score: " + score, 20, 50);
  };

  const flappyUpdate = () => {
    if (gameOver) return;

    // Bird physics
    let newBird = { ...flappyBirdRef.current };
    newBird.vy += FLAPPY_GRAVITY;
    newBird.y += newBird.vy;

    // Floor & ceiling collision
    if (newBird.y + FLAPPY_BIRD_SIZE > FLAPPY_HEIGHT || newBird.y < 0) {
      setGameOver(true);
      return;
    }

    // Pipes movement
    let newPipes = flappyPipesRef.current.map((p) => ({ ...p, x: p.x - FLAPPY_PIPE_SPEED }));
    
    // Remove off-screen pipes and add score
    if (newPipes.length > 0 && newPipes[0].x + FLAPPY_PIPE_WIDTH < 0) {
      newPipes.shift();
      setScore((prev) => prev + 10);
    }

    // Add new pipe with better spacing
    if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < FLAPPY_WIDTH - 350) {
      newPipes.push({
        x: FLAPPY_WIDTH,
        y: Math.random() * (FLAPPY_HEIGHT - FLAPPY_PIPE_GAP - 200) + 100,
      });
    }

    // Collision detection with pipes
    for (let p of newPipes) {
      if (
        newBird.x + FLAPPY_BIRD_SIZE > p.x &&
        newBird.x < p.x + FLAPPY_PIPE_WIDTH &&
        (newBird.y < p.y || newBird.y + FLAPPY_BIRD_SIZE > p.y + FLAPPY_PIPE_GAP)
      ) {
        setGameOver(true);
        return;
      }
    }

    setFlappyBird(newBird);
    setFlappyPipes(newPipes);

    if (flappyCanvasRef.current) {
      const ctx = flappyCanvasRef.current.getContext("2d");
      if (ctx) flappyDraw(ctx);
    }
  };

  // Flappy Bird game loop
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'flappy') return;

    // Initialize pipes
    if (flappyPipesRef.current.length === 0) {
      setFlappyPipes([{ x: FLAPPY_WIDTH, y: Math.random() * (FLAPPY_HEIGHT - FLAPPY_PIPE_GAP - 200) + 100 }]);
    }

    // Initialize canvas
    if (flappyCanvasRef.current) {
      const ctx = flappyCanvasRef.current.getContext("2d");
      if (ctx) flappyDraw(ctx);
    }

    const flappyInterval = setInterval(() => {
      flappyUpdate();
    }, 20);

    return () => clearInterval(flappyInterval);
  }, [isPlaying, gameOver, currentGameType]);

  // Flappy Bird click/tap controls
  const handleFlappyJump = () => {
    if (isPlaying && currentGameType === 'flappy' && !gameOver) {
      setFlappyBird(prev => ({ ...prev, vy: FLAPPY_JUMP }));
    }
  };

  // Update Car refs when state changes
  useEffect(() => {
    carPlayerRef.current = carPlayer;
  }, [carPlayer]);

  useEffect(() => {
    carObstaclesRef.current = carObstacles;
  }, [carObstacles]);

  // Car Race game logic
  const drawCar = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isPlayer: boolean) => {
    const width = isPlayer ? CAR_PLAYER_WIDTH : CAR_OBSTACLE_WIDTH;
    const height = isPlayer ? CAR_PLAYER_HEIGHT : CAR_OBSTACLE_HEIGHT;
    
    // Car body
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    
    // Car roof (darker)
    ctx.fillStyle = isPlayer ? "#AA0000" : "#006666";
    ctx.beginPath();
    ctx.roundRect(x + 5, y + height * 0.3, width - 10, height * 0.3, 5);
    ctx.fill();
    
    // Windows
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x + 8, y + height * 0.35, width - 16, height * 0.15);
    ctx.fillRect(x + 8, y + height * 0.52, width - 16, height * 0.15);
    
    // Headlights/Taillights
    if (isPlayer) {
      // Taillights (red)
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(x + 5, y + height - 8, 15, 6);
      ctx.fillRect(x + width - 20, y + height - 8, 15, 6);
    } else {
      // Headlights (yellow)
      ctx.fillStyle = "#FFFF00";
      ctx.fillRect(x + 5, y + 2, 15, 6);
      ctx.fillRect(x + width - 20, y + 2, 15, 6);
    }
    
    // Wheels
    ctx.fillStyle = "#000000";
    ctx.fillRect(x - 3, y + 15, 8, 20);
    ctx.fillRect(x + width - 5, y + 15, 8, 20);
    ctx.fillRect(x - 3, y + height - 35, 8, 20);
    ctx.fillRect(x + width - 5, y + height - 35, 8, 20);
    
    ctx.shadowBlur = 0;
  };

  const carDraw = (ctx: CanvasRenderingContext2D) => {
    const player = carPlayerRef.current;
    const obstacles = carObstaclesRef.current;
    
    ctx.clearRect(0, 0, CAR_WIDTH, CAR_HEIGHT);
    
    // Grass/shoulder
    ctx.fillStyle = "#2d5016";
    ctx.fillRect(0, 0, CAR_WIDTH, CAR_HEIGHT);
    
    // Road background
    const roadStartX = (CAR_WIDTH - CAR_ROAD_WIDTH) / 2;
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(roadStartX, 0, CAR_ROAD_WIDTH, CAR_HEIGHT);
    
    // Road edges (white lines)
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(roadStartX, 0);
    ctx.lineTo(roadStartX, CAR_HEIGHT);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(roadStartX + CAR_ROAD_WIDTH, 0);
    ctx.lineTo(roadStartX + CAR_ROAD_WIDTH, CAR_HEIGHT);
    ctx.stroke();

    // Lane dividers (animated dashed lines)
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    for (let lane = 1; lane < CAR_NUM_LANES; lane++) {
      const laneX = roadStartX + (lane * CAR_LANE_WIDTH);
      for (let i = carRoadOffset; i < CAR_HEIGHT; i += 60) {
        ctx.beginPath();
        ctx.moveTo(laneX, i);
        ctx.lineTo(laneX, i + 30);
        ctx.stroke();
      }
    }

    // Draw obstacles (enemy cars)
    obstacles.forEach((o) => {
      drawCar(ctx, o.x, o.y, "#00FFFF", false);
    });

    // Draw player car
    drawCar(ctx, player.x, player.y, "#FF0000", true);

    // Score
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText("Score: " + score, 20, 50);
    ctx.fillText("Score: " + score, 20, 50);
  };

  const getRandomLane = () => {
    const roadStartX = (CAR_WIDTH - CAR_ROAD_WIDTH) / 2;
    const lane = Math.floor(Math.random() * CAR_NUM_LANES);
    return roadStartX + (lane * CAR_LANE_WIDTH) + (CAR_LANE_WIDTH - CAR_OBSTACLE_WIDTH) / 2;
  };

  const carUpdate = () => {
    if (gameOver) return;

    // Animate road lines
    setCarRoadOffset(prev => (prev + CAR_OBSTACLE_SPEED) % 60);

    // Move obstacles
    let newObstacles = carObstaclesRef.current.map((o) => ({ ...o, y: o.y + CAR_OBSTACLE_SPEED }));

    // Reset obstacles that pass the bottom
    newObstacles = newObstacles.map((o) => {
      if (o.y > CAR_HEIGHT) {
        setScore((prev) => prev + 10);
        return { x: getRandomLane(), y: -CAR_OBSTACLE_HEIGHT };
      }
      return o;
    });

    // Collision detection
    const player = carPlayerRef.current;
    for (let o of newObstacles) {
      if (
        player.x < o.x + CAR_OBSTACLE_WIDTH &&
        player.x + CAR_PLAYER_WIDTH > o.x &&
        player.y < o.y + CAR_OBSTACLE_HEIGHT &&
        player.y + CAR_PLAYER_HEIGHT > o.y
      ) {
        setGameOver(true);
        return;
      }
    }

    setCarObstacles(newObstacles);

    if (carCanvasRef.current) {
      const ctx = carCanvasRef.current.getContext("2d");
      if (ctx) carDraw(ctx);
    }
  };

  // Car Race game loop
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'car-race') return;

    // Initialize obstacles in lanes
    if (carObstaclesRef.current.length === 0) {
      const roadStartX = (CAR_WIDTH - CAR_ROAD_WIDTH) / 2;
      const initialObstacles = [];
      for (let i = 0; i < 5; i++) {
        const lane = Math.floor(Math.random() * CAR_NUM_LANES);
        initialObstacles.push({
          x: roadStartX + (lane * CAR_LANE_WIDTH) + (CAR_LANE_WIDTH - CAR_OBSTACLE_WIDTH) / 2,
          y: -i * 200,
        });
      }
      setCarObstacles(initialObstacles);
    }

    // Initialize canvas
    if (carCanvasRef.current) {
      const ctx = carCanvasRef.current.getContext("2d");
      if (ctx) carDraw(ctx);
    }

    const carInterval = setInterval(() => {
      carUpdate();
    }, 20);

    return () => clearInterval(carInterval);
  }, [isPlaying, gameOver, currentGameType]);

  // Update Pong refs when state changes
  useEffect(() => {
    pongBallRef.current = pongBall;
  }, [pongBall]);

  useEffect(() => {
    pongPlayerPaddleYRef.current = pongPlayerPaddleY;
  }, [pongPlayerPaddleY]);

  useEffect(() => {
    pongAiPaddleYRef.current = pongAiPaddleY;
  }, [pongAiPaddleY]);

  // Pong game logic
  const pongDraw = (ctx: CanvasRenderingContext2D) => {
    const ball = pongBallRef.current;
    const playerY = pongPlayerPaddleYRef.current;
    const aiY = pongAiPaddleYRef.current;
    
    ctx.clearRect(0, 0, PONG_WIDTH, PONG_HEIGHT);
    
    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, PONG_WIDTH, PONG_HEIGHT);

    // Center line
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(PONG_WIDTH / 2, 0);
    ctx.lineTo(PONG_WIDTH / 2, PONG_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle (left - green)
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(20, playerY, PONG_PADDLE_WIDTH, PONG_PADDLE_HEIGHT);
    ctx.strokeStyle = "#00AA00";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, playerY, PONG_PADDLE_WIDTH, PONG_PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    // AI paddle (right - red)
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(PONG_WIDTH - 35, aiY, PONG_PADDLE_WIDTH, PONG_PADDLE_HEIGHT);
    ctx.strokeStyle = "#AA0000";
    ctx.lineWidth = 3;
    ctx.strokeRect(PONG_WIDTH - 35, aiY, PONG_PADDLE_WIDTH, PONG_PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    // Ball
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 25;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, PONG_BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Scores
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText(pongPlayerScore.toString(), PONG_WIDTH / 2 - 80, 60);
    ctx.fillText(pongPlayerScore.toString(), PONG_WIDTH / 2 - 80, 60);
    
    ctx.fillStyle = "#FF0000";
    ctx.strokeText(pongAiScore.toString(), PONG_WIDTH / 2 + 50, 60);
    ctx.fillText(pongAiScore.toString(), PONG_WIDTH / 2 + 50, 60);
  };

  const pongUpdate = () => {
    if (gameOver) return;

    let newBall = { ...pongBallRef.current };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Top & bottom collision
    if (newBall.y - PONG_BALL_SIZE < 0 || newBall.y + PONG_BALL_SIZE > PONG_HEIGHT) {
      newBall.dy = -newBall.dy;
    }

    const playerY = pongPlayerPaddleYRef.current;
    const aiY = pongAiPaddleYRef.current;

    // Player paddle collision
    if (
      newBall.x - PONG_BALL_SIZE < 35 &&
      newBall.y > playerY &&
      newBall.y < playerY + PONG_PADDLE_HEIGHT
    ) {
      newBall.dx = Math.abs(newBall.dx);
      // Add spin based on where ball hits paddle
      const hitPos = (newBall.y - playerY) / PONG_PADDLE_HEIGHT;
      newBall.dy = (hitPos - 0.5) * 10;
    }

    // AI paddle collision
    if (
      newBall.x + PONG_BALL_SIZE > PONG_WIDTH - 35 &&
      newBall.y > aiY &&
      newBall.y < aiY + PONG_PADDLE_HEIGHT
    ) {
      newBall.dx = -Math.abs(newBall.dx);
      // Add spin based on where ball hits paddle
      const hitPos = (newBall.y - aiY) / PONG_PADDLE_HEIGHT;
      newBall.dy = (hitPos - 0.5) * 10;
    }

    // Score - player misses (AI gets point)
    if (newBall.x - PONG_BALL_SIZE < 0) {
      setPongAiScore((prev) => prev + 1);
      // Ball serves toward player after AI scores
      newBall = { 
        x: PONG_WIDTH / 2, 
        y: PONG_HEIGHT / 2, 
        dx: -PONG_BALL_SPEED, 
        dy: (Math.random() - 0.5) * 6 
      };
    }

    // Score - AI misses (player gets point)
    if (newBall.x + PONG_BALL_SIZE > PONG_WIDTH) {
      setPongPlayerScore((prev) => prev + 1);
      setScore(prev => prev + 10);
      // Ball serves toward AI after player scores
      newBall = { 
        x: PONG_WIDTH / 2, 
        y: PONG_HEIGHT / 2, 
        dx: PONG_BALL_SPEED, 
        dy: (Math.random() - 0.5) * 6 
      };
    }

    // AI movement
    let newAiY = aiY;
    if (newBall.y > aiY + PONG_PADDLE_HEIGHT / 2) newAiY += PONG_AI_SPEED;
    if (newBall.y < aiY + PONG_PADDLE_HEIGHT / 2) newAiY -= PONG_AI_SPEED;
    if (newAiY < 0) newAiY = 0;
    if (newAiY + PONG_PADDLE_HEIGHT > PONG_HEIGHT) newAiY = PONG_HEIGHT - PONG_PADDLE_HEIGHT;

    setPongAiPaddleY(newAiY);
    setPongBall(newBall);

    if (pongCanvasRef.current) {
      const ctx = pongCanvasRef.current.getContext("2d");
      if (ctx) pongDraw(ctx);
    }
  };

  // Pong game loop
  useEffect(() => {
    if (!isPlaying || gameOver || currentGameType !== 'pong') return;

    // Initialize canvas
    if (pongCanvasRef.current) {
      const ctx = pongCanvasRef.current.getContext("2d");
      if (ctx) pongDraw(ctx);
    }

    const pongInterval = setInterval(() => {
      pongUpdate();
    }, 16);

    return () => clearInterval(pongInterval);
  }, [isPlaying, gameOver, currentGameType]);

  // Pong mouse controls
  const handlePongMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying && currentGameType === 'pong' && !gameOver && pongCanvasRef.current) {
      const rect = pongCanvasRef.current.getBoundingClientRect();
      let y = e.clientY - rect.top - PONG_PADDLE_HEIGHT / 2;
      if (y < 0) y = 0;
      if (y + PONG_PADDLE_HEIGHT > PONG_HEIGHT) y = PONG_HEIGHT - PONG_PADDLE_HEIGHT;
      setPongPlayerPaddleY(y);
    }
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
        gridTemplateColumns: `repeat(${PACMAN_COLS}, 20px)`,
        gridTemplateRows: `repeat(${PACMAN_ROWS}, 20px)`,
        maxWidth: '350px',
        margin: '0 auto'
      }}>
        {pacmanMap.flat().map((cell, idx) => {
          const row = Math.floor(idx / PACMAN_COLS);
          const col = idx % PACMAN_COLS;
          const ghost = ghosts.find(g => g.x === col && g.y === row);
          
          let cellStyle: React.CSSProperties = {
            width: '20px',
            height: '20px',
            backgroundColor: '#222',
            borderRadius: '0%',
            border: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
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
            cellStyle.backgroundColor = ghost?.color === 'red' ? '#FF0000' : 
                                      ghost?.color === 'pink' ? '#FF69B4' :
                                      ghost?.color === 'cyan' ? '#00FFFF' :
                                      ghost?.color === 'orange' ? '#FFA500' : '#FF0000';
            cellStyle.borderRadius = '50%';
            cellStyle.boxShadow = `0 0 10px ${ghost?.color === 'red' ? '#FF0000' : 
                                              ghost?.color === 'pink' ? '#FF69B4' :
                                              ghost?.color === 'cyan' ? '#00FFFF' :
                                              ghost?.color === 'orange' ? '#FFA500' : '#FF0000'}`;
          }
          
          return (
            <div
              key={idx}
              style={cellStyle}
            >
              {cell === PACMAN_PELLET && (
                <div 
                  style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#FFD700',
                    borderRadius: '50%',
                    boxShadow: '0 0 4px #FFD700'
                  }}
                />
              )}
              {cell === PACMAN_GHOST && ghost && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  width: '4px',
                  height: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: '4px 0 0 white, 0 4px 0 white, 4px 4px 0 white'
                }} />
              )}
            </div>
          );
        })}
      </div>
    )}

                      {/* Pinball Game */}
                      {currentGameType === 'pinball' && (
                        <div className="flex flex-col items-center justify-center">
                          <canvas 
                            ref={pinballCanvasRef} 
                            width={PINBALL_WIDTH} 
                            height={PINBALL_HEIGHT} 
                            style={{ 
                              backgroundColor: "#111", 
                              border: "3px solid #4169E1",
                              borderRadius: "8px",
                              boxShadow: "0 0 20px #4169E1"
                            }} 
                          />
                          <div className="mt-4 text-center">
                            <div className="pixel-text text-sm neon-text-cyan mb-2">
                              LEFT/RIGHT ARROWS: FLIPPERS • SPACE: LAUNCH BALL
                            </div>
                            <div className="pixel-text text-xs neon-text-yellow">
                              Hit bumpers for points! Keep the ball in play!
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Breakout Game */}
                      {currentGameType === 'breakout' && (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <canvas 
                            ref={breakoutCanvasRef} 
                            width={BREAKOUT_WIDTH} 
                            height={BREAKOUT_HEIGHT} 
                            style={{ 
                              backgroundColor: "#111", 
                              border: "4px solid #4169E1",
                              borderRadius: "12px",
                              boxShadow: "0 0 30px #4169E1",
                              maxWidth: "90vw",
                              maxHeight: "90vh"
                            }} 
                          />
                          <div className="mt-6 text-center">
                            <div className="pixel-text text-lg neon-text-cyan mb-3">
                              🖱️ MOUSE: MOVE PADDLE • BREAK ALL BRICKS!
                            </div>
                            <div className="pixel-text text-sm neon-text-yellow">
                              Keep ball in play! Don't let it fall! Game ends in 1 minute!
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Flappy Bird Game */}
                      {currentGameType === 'flappy' && (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <canvas 
                            ref={flappyCanvasRef} 
                            width={FLAPPY_WIDTH} 
                            height={FLAPPY_HEIGHT} 
                            onClick={handleFlappyJump}
                            style={{ 
                              backgroundColor: "#87CEEB", 
                              border: "4px solid #4169E1",
                              borderRadius: "12px",
                              boxShadow: "0 0 30px #4169E1",
                              maxWidth: "90vw",
                              maxHeight: "90vh",
                              cursor: "pointer"
                            }} 
                          />
                          <div className="mt-6 text-center">
                            <div className="pixel-text text-lg neon-text-cyan mb-3">
                              🐦 CLICK/TAP: JUMP • AVOID PIPES!
                            </div>
                            <div className="pixel-text text-sm neon-text-yellow">
                              Keep the bird flying! Don't hit pipes or ground! Game ends in 1 minute!
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Car Race Game */}
                      {currentGameType === 'car-race' && (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <canvas 
                            ref={carCanvasRef} 
                            width={CAR_WIDTH} 
                            height={CAR_HEIGHT} 
                            style={{ 
                              backgroundColor: "#2a2a2a", 
                              border: "4px solid #4169E1",
                              borderRadius: "12px",
                              boxShadow: "0 0 30px #4169E1",
                              maxWidth: "90vw",
                              maxHeight: "90vh"
                            }} 
                          />
                          <div className="mt-6 text-center">
                            <div className="pixel-text text-lg neon-text-cyan mb-3">
                              🏎️ LEFT/RIGHT ARROWS: STEER • DODGE TRAFFIC!
                            </div>
                            <div className="pixel-text text-sm neon-text-yellow">
                              Avoid obstacles! Don't crash! Game ends in 1 minute!
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pong Game */}
                      {currentGameType === 'pong' && (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <canvas 
                            ref={pongCanvasRef} 
                            width={PONG_WIDTH} 
                            height={PONG_HEIGHT} 
                            onMouseMove={handlePongMouseMove}
                            style={{ 
                              backgroundColor: "#0a0a0a", 
                              border: "4px solid #4169E1",
                              borderRadius: "12px",
                              boxShadow: "0 0 30px #4169E1",
                              maxWidth: "90vw",
                              maxHeight: "90vh",
                              cursor: "none"
                            }} 
                          />
                          <div className="mt-6 text-center">
                            <div className="pixel-text text-lg neon-text-cyan mb-3">
                              🏓 MOUSE: MOVE PADDLE • BEAT THE AI!
                            </div>
                            <div className="pixel-text text-sm neon-text-yellow">
                              First to score wins! Game ends in 1 minute!
                            </div>
                          </div>
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
                          <div className="text-yellow-400">Level: {level} | Pellets: {pelletsCollected}</div>
                          <div className="text-red-400">4 Ghosts hunting you!</div>
                        </div>
                      )}
                      {currentGameType === 'pinball' && (
                        <div className="pixel-text text-xs neon-text-cyan">
                          LEFT/RIGHT ARROWS: FLIPPERS  •  SPACE: LAUNCH BALL  •  HIT BUMPERS FOR POINTS
                        </div>
                      )}
                      {currentGameType === 'breakout' && (
                        <div className="pixel-text text-sm neon-text-cyan">
                          🖱️ MOUSE: MOVE PADDLE  •  BREAK ALL BRICKS  •  KEEP BALL IN PLAY
                        </div>
                      )}
                      {currentGameType === 'flappy' && (
                        <div className="pixel-text text-sm neon-text-cyan">
                          🐦 CLICK/TAP SCREEN: JUMP  •  AVOID PIPES  •  DON'T HIT GROUND
                        </div>
                      )}
                      {currentGameType === 'car-race' && (
                        <div className="pixel-text text-sm neon-text-cyan">
                          🏎️ LEFT/RIGHT ARROWS: STEER  •  DODGE TRAFFIC  •  DON'T CRASH
                        </div>
                      )}
                      {currentGameType === 'pong' && (
                        <div className="pixel-text text-sm neon-text-cyan">
                          🏓 MOUSE: MOVE PADDLE  •  BEAT THE AI  •  SCORE POINTS
                        </div>
                      )}
                      {playTime < 60 && (
                        <div className="pixel-text text-xs neon-text-magenta animate-pulse">
                          🏆 Play for 1 minute to earn 3 trophies! ({formatTime(60 - playTime)} remaining)
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