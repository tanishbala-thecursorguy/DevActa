import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface PostHackathonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: (data: {
    title: string;
    summary: string;
    prizeMoney: number;
    discordLink: string;
    meetLink: string;
  }) => void;
}

export function PostHackathonDialog({ open, onOpenChange, onPost }: PostHackathonDialogProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [prizeMoney, setPrizeMoney] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && summary && prizeMoney && discordLink && meetLink) {
      onPost({
        title,
        summary,
        prizeMoney: parseFloat(prizeMoney),
        discordLink,
        meetLink,
      });
      // Reset form
      setTitle("");
      setSummary("");
      setPrizeMoney("");
      setDiscordLink("");
      setMeetLink("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Post Hackathon</DialogTitle>
          <DialogDescription>
            Create a new hackathon event and invite developers to participate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Hackathon Title</Label>
            <Input
              id="title"
              placeholder="e.g., AI Innovation Challenge 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="professional-input"
            />
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Describe your hackathon, goals, themes, and what participants will build..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              required
              className="professional-input"
            />
          </div>

          <div>
            <Label htmlFor="prizeMoney">Prize Money ($)</Label>
            <Input
              id="prizeMoney"
              type="number"
              placeholder="50000"
              value={prizeMoney}
              onChange={(e) => setPrizeMoney(e.target.value)}
              required
              className="professional-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discordLink" className="flex items-center space-x-2">
                <span>Discord Link</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </Label>
              <Input
                id="discordLink"
                type="url"
                placeholder="https://discord.gg/..."
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                required
                className="professional-input"
              />
            </div>

            <div>
              <Label htmlFor="meetLink" className="flex items-center space-x-2">
                <span>Google Meet Link</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
                </svg>
              </Label>
              <Input
                id="meetLink"
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                required
                className="professional-input"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="professional-button-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" className="professional-button-primary">
              Post Hackathon
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
