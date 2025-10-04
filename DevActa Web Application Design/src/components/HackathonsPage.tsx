import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus } from "lucide-react";
import { PostHackathonDialog } from "./PostHackathonDialog";
import { mockHackathons, currentUser } from "../data/mockData";

export function HackathonsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hackathons, setHackathons] = useState(mockHackathons);

  // Falling emojis for hackathons (networking themed)
  const hackathonEmojis = ['💻', '🌐', '🔗', '📡', '🤝', '💡', '⚡', '🚀', '🎯', '🏆', '👥', '🔌', '📱', '💬', '🌟'];

  useEffect(() => {
    const emojiContainer = document.getElementById('emoji-container-hackathon');
    if (!emojiContainer) return;

    // Create continuous stream of emojis
    const createEmoji = () => {
      const emoji = document.createElement('div');
      emoji.className = 'falling-emoji';
      emoji.textContent = hackathonEmojis[Math.floor(Math.random() * hackathonEmojis.length)];
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
    prizeMoney: number;
    discordLink: string;
    meetLink: string;
  }) => {
    const newHackathon = {
      id: hackathons.length + 1,
      ...data,
      postedBy: currentUser.name,
      postedDate: "Just now",
      status: "upcoming",
      participants: 0,
    };
    setHackathons([newHackathon, ...hackathons]);
  };

  const upcomingHackathons = hackathons.filter((h) => h.status === "upcoming");
  const pastHackathons = hackathons.filter((h) => h.status === "past");

  const HackathonCard = ({ hackathon }: { hackathon: any }) => (
    <Card className="p-6 professional-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl mb-2 text-foreground">{hackathon.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{hackathon.summary}</p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-3 mb-4">
        <Badge className="professional-badge-prize text-base px-4 py-1">
          💰 ${hackathon.prizeMoney.toLocaleString()}
        </Badge>
        <Badge variant="secondary" className="professional-badge-participants">
          👥 {hackathon.participants} participants
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="professional-button-secondary"
            onClick={() => window.open(hackathon.discordLink, "_blank")}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="professional-button-secondary"
            onClick={() => window.open(hackathon.meetLink, "_blank")}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
            </svg>
            Meet
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          by {hackathon.postedBy} • {hackathon.postedDate}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* Falling Emojis Background */}
      <div id="emoji-container-hackathon" className="emoji-background"></div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2 text-foreground">Hackathons</h1>
            <p className="text-muted-foreground">
              Join exciting hackathons, compete for prizes, and build amazing projects
            </p>
          </div>

          <Button
            className="professional-button-primary"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Post Hackathon
          </Button>
        </div>

        {/* Tabs for Upcoming/Past */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="professional-tabs">
            <TabsTrigger value="upcoming" className="professional-tab">
              🚀 Upcoming ({upcomingHackathons.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="professional-tab">
              📜 Past ({pastHackathons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingHackathons.length === 0 ? (
              <Card className="p-12 bg-card text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl mb-2">No Upcoming Hackathons</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a hackathon event!
                </p>
                <Button className="professional-button-primary" onClick={() => setDialogOpen(true)}>
                  Create Hackathon
                </Button>
              </Card>
            ) : (
              upcomingHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastHackathons.length === 0 ? (
              <Card className="p-12 bg-card text-center">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-xl mb-2">No Past Hackathons</h3>
                <p className="text-muted-foreground">Past hackathons will appear here</p>
              </Card>
            ) : (
              pastHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Dialog */}
      <PostHackathonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPost={handlePost}
      />
    </div>
  );
}