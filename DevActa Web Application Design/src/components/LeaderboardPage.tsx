import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { mockUsers } from "../data/mockData";

export function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.trophies - a.trophies);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank.toString();
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500/10 border-yellow-500/20";
      case 2: return "bg-gray-500/10 border-gray-500/20";
      case 3: return "bg-orange-500/10 border-orange-500/20";
      default: return "bg-card border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Top Developers</h1>
          <p className="text-muted-foreground">Rankings based on trophies earned through reviews, challenges, and contributions</p>
        </div>

        <Card className="bg-card">
          <div className="p-6">
            <div className="hidden md:grid md:grid-cols-6 gap-4 pb-4 border-b border-border text-sm text-muted-foreground mb-4">
              <div>Rank</div>
              <div className="col-span-2">Developer</div>
              <div>Role</div>
              <div>Trophies</div>
              <div>GitHub</div>
            </div>

            <div className="space-y-4">
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                return (
                  <div 
                    key={user.id} 
                    className={`p-4 rounded-lg border transition-all hover:shadow-sm ${getRankColor(rank)}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      {/* Rank */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {rank <= 3 ? (
                            <span className="text-xl">{getRankIcon(rank)}</span>
                          ) : (
                            <span className="text-muted-foreground">{rank}</span>
                          )}
                        </div>
                      </div>

                      {/* Developer Info */}
                      <div className="col-span-2 flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-base">{user.name}</h3>
                          <p className="text-sm text-muted-foreground md:hidden">{user.role}</p>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="hidden md:block">
                        <Badge variant="secondary">
                          {user.role}
                        </Badge>
                      </div>

                      {/* Trophies */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏆</span>
                        <span className="text-lg">{user.trophies}</span>
                      </div>

                      {/* GitHub Link */}
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(user.github, '_blank')}
                        >
                          View GitHub
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-card text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl mb-1">{sortedUsers.reduce((sum, user) => sum + user.trophies, 0)}</div>
            <div className="text-muted-foreground">Total Trophies</div>
          </Card>
          
          <Card className="p-6 bg-card text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl mb-1">{sortedUsers.length}</div>
            <div className="text-muted-foreground">Active Developers</div>
          </Card>
          
          <Card className="p-6 bg-card text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl mb-1">{Math.round(sortedUsers.reduce((sum, user) => sum + user.trophies, 0) / sortedUsers.length)}</div>
            <div className="text-muted-foreground">Average Trophies</div>
          </Card>
        </div>
      </div>
    </div>
  );
}