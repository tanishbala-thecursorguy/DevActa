export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    role: "Full Stack Developer",
    trophies: 220,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  },
  {
    id: 2,
    name: "Alice Kim",
    role: "Frontend Developer",
    trophies: 185,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com/alicekim",
    linkedin: "https://linkedin.com/in/alicekim"
  },
  {
    id: 3,
    name: "Raj Patel",
    role: "Backend Developer",
    trophies: 267,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com/rajpatel",
    linkedin: "https://linkedin.com/in/rajpatel"
  },
  {
    id: 4,
    name: "Maria Lopez",
    role: "ML Engineer",
    trophies: 312,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com/marialopez",
    linkedin: "https://linkedin.com/in/marialopez"
  },
  {
    id: 5,
    name: "Chen Wei",
    role: "DevOps Engineer",
    trophies: 198,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com/chenwei",
    linkedin: "https://linkedin.com/in/chenwei"
  }
];

export const mockRepos = [
  {
    id: 1,
    title: "WeatherApp API",
    description: "A comprehensive weather API built with Node.js and Express. Features real-time weather data, forecasting, and location-based services. Includes proper error handling and rate limiting.",
    userId: 1,
    github: "https://github.com/johndoe/weather-api",
    reactions: { neutral: 2, numb: 1, happy: 8 },
    reviews: ["Great structure!", "Clean codebase", "Well documented API"]
  },
  {
    id: 2,
    title: "Chatbot AI",
    description: "An intelligent chatbot powered by machine learning. Built with Python and TensorFlow, featuring natural language processing and context awareness. Deployed on AWS with Docker.",
    userId: 4,
    github: "https://github.com/marialopez/chatbot-ai",
    reactions: { neutral: 1, numb: 0, happy: 12 },
    reviews: ["Impressive ML implementation", "Great use of TensorFlow", "Could use more comments"]
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A responsive portfolio website built with React and TypeScript. Features smooth animations, dark mode toggle, and optimized performance. Deployed on Netlify with CI/CD pipeline.",
    userId: 2,
    github: "https://github.com/alicekim/portfolio",
    reactions: { neutral: 3, numb: 1, happy: 15 },
    reviews: ["Beautiful design", "Smooth animations", "Great use of React hooks"]
  },
  {
    id: 4,
    title: "Game Engine Demo",
    description: "A 2D game engine built from scratch in C++. Features physics simulation, collision detection, and sprite rendering. Includes example games and comprehensive documentation.",
    userId: 3,
    github: "https://github.com/rajpatel/game-engine",
    reactions: { neutral: 4, numb: 2, happy: 9 },
    reviews: ["Complex but well organized", "Impressive C++ skills", "Good documentation"]
  }
];

export const mockGames = [
  { id: 1, title: "Snake", description: "Eat food and grow longer", thumbnail: "🐍", difficulty: "Easy", time: "5-10 min", reward: 10 },
  { id: 2, title: "Tetris", description: "Classic block puzzle game", thumbnail: "🟦", difficulty: "Medium", time: "10-15 min", reward: 15 },
  { id: 3, title: "Pac-Man", description: "Navigate maze and eat dots", thumbnail: "👻", difficulty: "Medium", time: "10-20 min", reward: 15 },
  { id: 4, title: "Pinball", description: "Keep the ball in play", thumbnail: "🎯", difficulty: "Hard", time: "15-25 min", reward: 20 },
  { id: 5, title: "Breakout", description: "Break all the bricks", thumbnail: "🧱", difficulty: "Medium", time: "10-15 min", reward: 12 },
  { id: 6, title: "Flappy", description: "Navigate through pipes", thumbnail: "🐦", difficulty: "Hard", time: "5-10 min", reward: 18 },
  { id: 7, title: "Car Race", description: "Dodge traffic and win", thumbnail: "🏎️", difficulty: "Medium", time: "10-15 min", reward: 14 },
  { id: 8, title: "Pong", description: "Classic ping pong game", thumbnail: "🏓", difficulty: "Easy", time: "5-10 min", reward: 8 },
  { id: 9, title: "Space Shooter", description: "Defend Earth from aliens", thumbnail: "👾", difficulty: "Hard", time: "15-20 min", reward: 20 },
  { id: 10, title: "Brick Blast", description: "Match and blast bricks", thumbnail: "💥", difficulty: "Easy", time: "10-15 min", reward: 10 },
  { id: 11, title: "Minesweeper", description: "Find all the mines", thumbnail: "💣", difficulty: "Hard", time: "10-20 min", reward: 18 },
  { id: 12, title: "2048", description: "Merge tiles to 2048", thumbnail: "🔢", difficulty: "Medium", time: "15-25 min", reward: 16 },
  { id: 13, title: "Jump Dino", description: "Jump over obstacles", thumbnail: "🦖", difficulty: "Easy", time: "5-10 min", reward: 8 },
  { id: 14, title: "Memory", description: "Match all the pairs", thumbnail: "🧠", difficulty: "Easy", time: "5-10 min", reward: 10 },
  { id: 15, title: "Maze Run", description: "Find your way out", thumbnail: "🌀", difficulty: "Medium", time: "10-15 min", reward: 14 }
];

export const currentUser = mockUsers[0];

export const mockHackathons = [
  {
    id: 1,
    title: "AI Innovation Challenge 2025",
    summary: "Build the next generation of AI-powered applications. Create innovative solutions using machine learning and natural language processing.",
    prizeMoney: 50000,
    discordLink: "https://discord.gg/ai-innovation",
    meetLink: "https://meet.google.com/xyz-demo-link",
    postedBy: "Maria Lopez",
    postedDate: "2 days ago",
    status: "upcoming",
    participants: 234
  },
  {
    id: 2,
    title: "Web3 Builder Hackathon",
    summary: "Develop decentralized applications on blockchain. Focus on DeFi, NFTs, or DAOs with cutting-edge smart contract development.",
    prizeMoney: 75000,
    discordLink: "https://discord.gg/web3-builders",
    meetLink: "https://meet.google.com/abc-demo-link",
    postedBy: "Chen Wei",
    postedDate: "5 days ago",
    status: "upcoming",
    participants: 189
  },
  {
    id: 3,
    title: "Sustainable Tech Summit",
    summary: "Create technology solutions for climate change and sustainability. Focus on green tech, renewable energy monitoring, or carbon tracking.",
    prizeMoney: 30000,
    discordLink: "https://discord.gg/sustainable-tech",
    meetLink: "https://meet.google.com/def-demo-link",
    postedBy: "John Doe",
    postedDate: "1 week ago",
    status: "upcoming",
    participants: 156
  },
  {
    id: 4,
    title: "HealthTech Innovation Week",
    summary: "Revolutionize healthcare with technology. Build apps for telemedicine, health monitoring, or medical data analysis.",
    prizeMoney: 40000,
    discordLink: "https://discord.gg/healthtech",
    meetLink: "https://meet.google.com/health-demo",
    postedBy: "Alice Kim",
    postedDate: "2 weeks ago",
    status: "past",
    participants: 301
  },
  {
    id: 5,
    title: "GameDev Showdown 2024",
    summary: "Create the most innovative indie game in 48 hours. Any genre, any platform, pure creativity unleashed.",
    prizeMoney: 25000,
    discordLink: "https://discord.gg/gamedev-showdown",
    meetLink: "https://meet.google.com/game-demo",
    postedBy: "Raj Patel",
    postedDate: "3 weeks ago",
    status: "past",
    participants: 412
  }
];

export const mockChallenges = [
  {
    id: 1,
    title: "Algorithm Speed Battle",
    summary: "Optimize sorting algorithms for massive datasets. Fastest implementation wins. Test your optimization skills against the best.",
    githubLink: "https://github.com/challenges/algo-speed",
    mode: "1v1",
    challenger: "Maria Lopez",
    postedDate: "1 day ago",
    participants: 2,
    maxParticipants: 2
  },
  {
    id: 2,
    title: "Full-Stack E-Commerce Build",
    summary: "Build a complete e-commerce platform with React, Node.js, and PostgreSQL. Include authentication, payment processing, and admin panel.",
    githubLink: "https://github.com/challenges/ecommerce-build",
    mode: "1v3",
    challenger: "John Doe",
    postedDate: "3 days ago",
    participants: 3,
    maxParticipants: 4
  },
  {
    id: 3,
    title: "API Design Masterclass",
    summary: "Design the most elegant and scalable RESTful API. Focus on clean architecture, proper documentation, and best practices.",
    githubLink: "https://github.com/challenges/api-design",
    mode: "1v5",
    challenger: "Chen Wei",
    postedDate: "5 days ago",
    participants: 4,
    maxParticipants: 6
  },
  {
    id: 4,
    title: "Mobile App UI/UX Showdown",
    summary: "Create the most beautiful and intuitive mobile app interface. Native or cross-platform, make it pixel perfect.",
    githubLink: "https://github.com/challenges/mobile-ui",
    mode: "1v2",
    challenger: "Alice Kim",
    postedDate: "1 week ago",
    participants: 3,
    maxParticipants: 3
  },
  {
    id: 5,
    title: "DevOps Pipeline Challenge",
    summary: "Build a complete CI/CD pipeline with automated testing, deployment, and monitoring. Docker, Kubernetes, and cloud deployment required.",
    githubLink: "https://github.com/challenges/devops-pipeline",
    mode: "1v10",
    challenger: "Raj Patel",
    postedDate: "2 weeks ago",
    participants: 8,
    maxParticipants: 11
  },
  {
    id: 6,
    title: "Security Audit Battle",
    summary: "Find and fix vulnerabilities in a deliberately vulnerable web application. Most security issues found and properly patched wins.",
    githubLink: "https://github.com/challenges/security-audit",
    mode: "1v4",
    challenger: "Maria Lopez",
    postedDate: "3 days ago",
    participants: 2,
    maxParticipants: 5
  }
];