import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { PostDialog } from "./PostDialog";
import { mockUsers, mockRepos, currentUser } from "../data/mockData";

interface FeedPageProps {
  onPageChange: (page: string) => void;
}

interface Post {
  id: number;
  title: string;
  description: string;
  userId: number;
  github: string;
  reactions: { neutral: number; numb: number; happy: number };
  reviews: any[];
  userReaction?: 'neutral' | 'numb' | 'happy' | null;
}

export function FeedPage({ onPageChange }: FeedPageProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockRepos.map(post => ({ ...post, userReaction: null })));

  const handleNewPost = (data: { title: string; description: string; githubLink: string }) => {
    const newPost: Post = {
      id: posts.length + 1,
      title: data.title,
      description: data.description,
      userId: currentUser.id,
      github: data.githubLink,
      reactions: { neutral: 0, numb: 0, happy: 0 },
      reviews: [],
      userReaction: null
    };
    setPosts([newPost, ...posts]);
  };

  const handleReaction = (postId: number, reactionType: 'neutral' | 'numb' | 'happy') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        
        // Remove previous reaction if exists
        if (post.userReaction) {
          newPost.reactions[post.userReaction] = Math.max(0, newPost.reactions[post.userReaction] - 1);
        }
        
        // If clicking same reaction, remove it
        if (post.userReaction === reactionType) {
          newPost.userReaction = null;
        } else {
          // Add new reaction
          newPost.reactions[reactionType] = newPost.reactions[reactionType] + 1;
          newPost.userReaction = reactionType;
        }
        
        return newPost;
      }
      return post;
    }));
  };

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case "neutral": return "😐";
      case "numb": return "😶";
      case "happy": return "☻";
      default: return "😐";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Sticky Layout Container */}
        <div className="relative">
          
          {/* Post Button - Transparent and Fixed */}
          <div className="sticky top-6 z-20 mb-6">
            <Card className="p-4 bg-card/70 backdrop-blur-md border-border/50">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-muted-foreground bg-background/80"
                  onClick={() => setPostDialogOpen(true)}
                >
                  Share your latest project...
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setPostDialogOpen(true)}
                >
                  Post
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Sidebar - Profile Card - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 z-10">
                <Card className="p-6 bg-card sticky-card">
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg mb-1">{currentUser.name}</h3>
                    <p className="text-muted-foreground mb-3">{currentUser.role}</p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-2xl">🏆</span>
                      <span className="text-lg">{currentUser.trophies}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(currentUser.github, '_blank')}
                    >
                      View GitHub
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Center Feed - Scrollable */}
            <div className="lg:col-span-2">
              <div className="scrollable-feed space-y-6 relative z-0">
                {posts.map((repo, index) => {
                  const user = mockUsers.find(u => u.id === repo.userId)!;
                  return (
                    <Card key={repo.id} className={`p-6 bg-card feed-post-card ${index === 0 ? 'first-post' : ''}`} style={index === 0 ? { zIndex: 15 } : {}}>
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="mb-1">{user.name}</h4>
                          <p className="text-muted-foreground text-sm">{user.role}</p>
                        </div>
                      </div>

                      <h3 className="text-lg mb-3">{repo.title}</h3>
                      <p className="text-foreground mb-4 leading-relaxed">{repo.description}</p>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mb-4"
                        onClick={() => window.open(repo.github, '_blank')}
                      >
                        View on GitHub
                      </Button>

                      {/* Reactions */}
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => handleReaction(repo.id, 'neutral')}
                            className={`flex items-center space-x-2 transition-all ${
                              repo.userReaction === 'neutral' 
                                ? 'text-foreground scale-110' 
                                : 'text-muted-foreground hover:text-foreground hover:scale-105'
                            }`}
                          >
                            <span className="text-lg">😐</span>
                            <span>{repo.reactions.neutral}</span>
                          </button>
                          <button 
                            onClick={() => handleReaction(repo.id, 'numb')}
                            className={`flex items-center space-x-2 transition-all ${
                              repo.userReaction === 'numb' 
                                ? 'text-foreground scale-110' 
                                : 'text-muted-foreground hover:text-foreground hover:scale-105'
                            }`}
                          >
                            <span className="text-lg">😶</span>
                            <span>{repo.reactions.numb}</span>
                          </button>
                          <button 
                            onClick={() => handleReaction(repo.id, 'happy')}
                            className={`flex items-center space-x-2 transition-all ${
                              repo.userReaction === 'happy' 
                                ? 'text-foreground scale-110' 
                                : 'text-muted-foreground hover:text-foreground hover:scale-105'
                            }`}
                          >
                            <span className="text-lg">☻</span>
                            <span>{repo.reactions.happy}</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar - Top Developers - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 z-10">
                <Card className="p-6 bg-card sticky-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg">Top Developers</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onPageChange("leaderboard")}
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {mockUsers.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3 hover:bg-muted/50 rounded-lg p-2 transition-colors">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {index < 3 ? (
                            <span className="text-lg">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.trophies} 🏆</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Dialog */}
      <PostDialog 
        open={postDialogOpen}
        onOpenChange={setPostDialogOpen}
        onPost={handleNewPost}
      />
    </div>
  );
}