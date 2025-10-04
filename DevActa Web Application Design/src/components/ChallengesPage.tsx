import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus } from "lucide-react";
import { PostChallengeDialog } from "./PostChallengeDialog";
import { mockChallenges, currentUser } from "../data/mockData";

export function ChallengesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [challenges, setChallenges] = useState(mockChallenges);
  const [filterMode, setFilterMode] = useState("all");

  // Falling emojis for challenges (fight/battle themed)
  const challengeEmojis = ['⚔️', '🛡️', '💪', '🥊', '🏹', '⚡', '🔥', '💥', '🎯', '🏆', '👊', '⚡', '🗡️', '🎖️', '💣'];

  useEffect(() => {
    const emojiContainer = document.getElementById('emoji-container-challenge');
    if (!emojiContainer) return;

    // Create continuous stream of emojis
    const createEmoji = () => {
      const emoji = document.createElement('div');
      emoji.className = 'falling-emoji';
      emoji.textContent = challengeEmojis[Math.floor(Math.random() * challengeEmojis.length)];
      emoji.style.left = `${Math.random() * 100}%`;
      emoji.style.animationDuration = `${Math.random() * 8 + 12}s`; // 12-20s duration
      emoji.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
      
      // Add random horizontal drift
      emoji.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
      
      emojiContainer.appendChild(emoji);

      // Remove emoji after animation completes
      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.parentNode.removeChild(emoji);
        }
      }, 25000); // Remove after 25s to ensure cleanup
    };

    // Create initial batch immediately (no delay)
    for (let i = 0; i < 30; i++) {
      createEmoji();
    }

    // Continue creating emojis at intervals for continuous flow
    const intervalId = setInterval(createEmoji, 800); // New emoji every 0.8 seconds

    return () => {
      clearInterval(intervalId);
      if (emojiContainer) {
        emojiContainer.innerHTML = '';
      }
    };
  }, []);

  const handlePost = (data: {
    title: string;
    summary: string;
    githubLink: string;
    mode: string;
  }) => {
    const newChallenge = {
      id: challenges.length + 1,
      ...data,
      challenger: currentUser.name,
      postedDate: "Just now",
      participants: 1,
      maxParticipants: parseInt(data.mode.split("v")[1]) + 1,
    };
    setChallenges([newChallenge, ...challenges]);
  };

  const challengeModes = ["all", "1v1", "1v2", "1v3", "1v4", "1v5", "1v6", "1v7", "1v8", "1v9", "1v10"];

  const filteredChallenges =
    filterMode === "all"
      ? challenges
      : challenges.filter((c) => c.mode === filterMode);

  const ChallengeCard = ({ challenge }: { challenge: any }) => {
    const isFull = challenge.participants >= challenge.maxParticipants;
    
    return (
      <Card className="p-6 professional-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl text-foreground">{challenge.title}</h3>
              <Badge className="professional-badge-mode">{challenge.mode} Challenge</Badge>
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-2">{challenge.summary}</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 mb-4">
          <Badge variant="secondary" className="professional-badge-participants">
            👥 {challenge.participants}/{challenge.maxParticipants} joined
          </Badge>
          {isFull && (
            <Badge variant="destructive" className="animate-pulse">
              🔒 Full
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="professional-button-secondary"
              onClick={() => window.open(challenge.githubLink, "_blank")}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Repo
            </Button>

            {!isFull && (
              <Button className="professional-button-primary">
                ⚔️ Join Challenge
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            by {challenge.challenger} • {challenge.postedDate}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Falling Emojis Background */}
      <div id="emoji-container-challenge" className="emoji-background"></div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2 text-foreground">Challenges</h1>
            <p className="text-muted-foreground">
              Compete with developers, test your skills, and prove your expertise
            </p>
          </div>

          <Button
            className="professional-button-primary"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Post Challenge
          </Button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="text-sm text-muted-foreground">Filter by mode:</label>
          <Select value={filterMode} onValueChange={setFilterMode}>
            <SelectTrigger className="w-48 professional-input">
              <SelectValue placeholder="All Challenges" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {challengeModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode === "all" ? "All Challenges" : `${mode} Challenges`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Showing {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Challenges Feed */}
        <div className="space-y-4">
          {filteredChallenges.length === 0 ? (
            <Card className="p-12 bg-card text-center">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl mb-2">No Challenges Found</h3>
              <p className="text-muted-foreground mb-4">
                {filterMode === "all"
                  ? "Be the first to create a coding challenge!"
                  : `No ${filterMode} challenges available. Try a different filter.`}
              </p>
              {filterMode === "all" && (
                <Button className="professional-button-primary" onClick={() => setDialogOpen(true)}>
                  Create Challenge
                </Button>
              )}
            </Card>
          ) : (
            filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))
          )}
        </div>
      </div>

      {/* Post Dialog */}
      <PostChallengeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPost={handlePost}
      />
    </div>
  );
}