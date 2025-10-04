import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockGames, currentUser } from "../data/mockData";

interface GamesPageProps {
  onGameSelect?: (gameId: number, gameTitle: string) => void;
}

export function GamesPage({ onGameSelect }: GamesPageProps) {
  const userCredits = 2;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* User Profile Banner */}
        <Card className="p-6 bg-card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h2 className="text-xl mb-1">Welcome back, {currentUser.name}!</h2>
                <p className="text-muted-foreground">Ready to play some classic games?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">⚡</span>
                <span className="text-lg">{userCredits} game credits</span>
              </div>
              <p className="text-sm text-muted-foreground">Earn more by completing challenges</p>
            </div>
          </div>
        </Card>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Retro Arcade Games</h1>
          <p className="text-muted-foreground">Play classic games, earn trophies, and compete with other players</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockGames.map((game) => (
            <Card key={game.id} className="p-6 bg-card hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{game.thumbnail}</span>
                </div>
                
                <h3 className="text-lg mb-2">{game.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant="secondary">
                      {Math.random() > 0.5 ? "Medium" : Math.random() > 0.5 ? "Easy" : "Hard"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Est. Time:</span>
                    <span>{Math.floor(Math.random() * 30 + 10)} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reward:</span>
                    <span>🏆 {Math.floor(Math.random() * 20 + 5)} points</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={userCredits === 0}
                  onClick={() => onGameSelect?.(game.id, game.title)}
                >
                  {userCredits > 0 ? "Play Now" : "No Credits"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Game Categories */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">Game Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Classic Arcade", icon: "👾", count: 8 },
              { name: "Puzzle Games", icon: "🧩", count: 6 },
              { name: "Action Games", icon: "⚡", count: 4 },
              { name: "Sports Games", icon: "🏓", count: 2 }
            ].map((category) => (
              <Card key={category.name} className="p-4 bg-card hover:bg-muted cursor-pointer transition-colors">
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h4 className="mb-1">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.count} games</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">Recent Achievements</h2>
          <Card className="p-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🥇</span>
                </div>
                <h4 className="mb-1">High Score</h4>
                <p className="text-sm text-muted-foreground">Tetris - Level 15</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="mb-1">Perfect Score</h4>
                <p className="text-sm text-muted-foreground">Pac-Man - No Deaths</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔥</span>
                </div>
                <h4 className="mb-1">5-Day Streak</h4>
                <p className="text-sm text-muted-foreground">Daily games completed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}