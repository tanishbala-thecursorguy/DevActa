import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Github, Linkedin, Trophy, Star, GitFork, ExternalLink, Settings, Edit, Calendar, MapPin, Zap, Target, Award } from 'lucide-react';

export function ProfilePage() {
  const userProfile = {
    name: 'Sarah Chen',
    username: '@sarahdev',
    title: 'Full Stack Wizard',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    level: 42,
    xp: 15740,
    xpToNext: 18000,
    totalScore: 17560,
    globalRank: 2,
    avatar: 'https://images.unsplash.com/photo-1681887001651-a15c749c1ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkZXZlbG9wZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5NTc1MzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Love working with React, Node.js, and cloud technologies. Gaming enthusiast and competitive programmer.',
    joinDate: 'March 2022',
    streak: 47,
    badges: ['🏆', '⚡', '🧠', '🎯', '🚀', '💎']
  };

  const repositories = [
    {
      name: 'ai-recipe-generator',
      description: 'AI-powered recipe generator using OpenAI API',
      language: 'TypeScript',
      languageColor: 'bg-blue-500',
      stars: 342,
      forks: 89,
      likes: 156,
      updatedAt: '2 days ago',
      isPrivate: false
    },
    {
      name: 'neural-network-visualizer',
      description: 'Interactive neural network visualization tool',
      language: 'Python',
      languageColor: 'bg-green-500',
      stars: 892,
      forks: 234,
      likes: 445,
      updatedAt: '1 week ago',
      isPrivate: false
    },
    {
      name: 'devops-automation-suite',
      description: 'Complete DevOps automation and monitoring',
      language: 'Go',
      languageColor: 'bg-cyan-500',
      stars: 156,
      forks: 45,
      likes: 78,
      updatedAt: '3 days ago',
      isPrivate: false
    },
    {
      name: 'react-game-engine',
      description: 'Lightweight game engine built with React',
      language: 'JavaScript',
      languageColor: 'bg-yellow-500',
      stars: 234,
      forks: 67,
      likes: 123,
      updatedAt: '5 days ago',
      isPrivate: false
    }
  ];

  const gameStats = [
    { name: 'Word Chain', bestScore: 1450, rank: '#23', wins: 34, color: 'text-blue-400' },
    { name: 'Logic Grid', bestScore: 2150, rank: '#8', wins: 28, color: 'text-purple-400' },
    { name: 'Number Rush', bestScore: 1320, rank: '#45', wins: 19, color: 'text-green-400' },
    { name: 'Memory Palace', bestScore: 980, rank: '#67', wins: 15, color: 'text-pink-400' }
  ];

  const achievements = [
    { name: 'Code Master', description: 'Created 50+ repositories', icon: '👑', rarity: 'Legendary', color: 'text-yellow-400' },
    { name: 'Game Champion', description: 'Won 100+ games', icon: '🏆', rarity: 'Epic', color: 'text-purple-400' },
    { name: 'Community Hero', description: 'Helped 500+ developers', icon: '⭐', rarity: 'Rare', color: 'text-blue-400' },
    { name: 'Speed Demon', description: 'Fastest completion times', icon: '⚡', rarity: 'Common', color: 'text-green-400' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'Epic': return 'bg-purple-500/20 border-purple-500/50';
      case 'Rare': return 'bg-blue-500/20 border-blue-500/50';
      default: return 'bg-green-500/20 border-green-500/50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Profile Header */}
      <Card className="glass-effect border-0 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar and Level */}
          <div className="relative">
            <ImageWithFallback
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-32 h-32 rounded-2xl object-cover"
            />
            
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-background"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl mb-2 text-foreground">{userProfile.name}</h1>
                <p className="text-lg text-muted-foreground mb-1">{userProfile.username}</p>
                <p className="text-[rgba(255,240,240,1)] mb-2">{userProfile.title}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  
                  
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-[rgba(0,0,0,1)] rounded-xl">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{userProfile.bio}</p>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm" className="border-border rounded-lg">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="border-border rounded-lg">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="border-border rounded-lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
            </div>

            {/* Badges */}
            <div className="flex items-center space-x-2">
              {userProfile.badges.map((badge, index) => (
                <span key={index} className="text-2xl">{badge}</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="glass-effect p-4 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl text-foreground">{userProfile.totalScore.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
            <div className="glass-effect p-4 rounded-xl">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl text-foreground">#{userProfile.globalRank}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </div>
            
            
          </div>
        </div>

        {/* Level Progress */}
        
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-effect border-0 p-2 rounded-xl">
          <TabsTrigger value="projects" className="rounded-lg">🚀 Projects</TabsTrigger>
          <TabsTrigger value="games" className="rounded-lg">🎮 Games</TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-lg">🏆 Achievements</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg">📊 Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repositories.map((repo, index) => (
              <Card key={index} className="glass-effect border-0 p-6 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-foreground">{repo.name}</h3>
                    {!repo.isPrivate && <Badge className="bg-green-500/20 text-green-400 text-xs">Public</Badge>}
                  </div>
                  <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-secondary/50">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${repo.languageColor} rounded-full`}></div>
                    <span className="text-sm text-muted-foreground">{repo.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{repo.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{repo.forks}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❤️</span>
                    <span className="text-sm text-muted-foreground">{repo.likes} likes</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{repo.updatedAt}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameStats.map((game, index) => (
              <Card key={index} className="glass-effect border-0 p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground">{game.name}</h3>
                  <Badge className={`${game.color} bg-current/20 border border-current/30 rounded-full`}>
                    {game.rank}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl text-foreground">{game.bestScore}</div>
                    <div className="text-xs text-muted-foreground">Best Score</div>
                  </div>
                  <div>
                    <div className="text-xl text-foreground">{game.wins}</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div>
                    <div className="text-xl text-foreground">{game.rank}</div>
                    <div className="text-xs text-muted-foreground">Rank</div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-white rounded-xl">
                  Play Now
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`glass-effect border p-6 card-hover ${getRarityColor(achievement.rarity)}`}>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-foreground">{achievement.name}</h3>
                      <Badge className={`${achievement.color} bg-current/20 text-xs`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="glass-effect border-0 p-8 text-center">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl text-foreground mb-2">Activity Dashboard Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We're building a comprehensive activity dashboard with contribution graphs, game history, and performance analytics.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              Get Early Access
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}