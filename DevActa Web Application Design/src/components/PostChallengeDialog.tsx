import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PostChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: (data: {
    title: string;
    summary: string;
    githubLink: string;
    mode: string;
  }) => void;
}

export function PostChallengeDialog({ open, onOpenChange, onPost }: PostChallengeDialogProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [mode, setMode] = useState("1v1");

  const challengeModes = [
    "1v1", "1v2", "1v3", "1v4", "1v5", 
    "1v6", "1v7", "1v8", "1v9", "1v10"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && summary && githubLink && mode) {
      onPost({
        title,
        summary,
        githubLink,
        mode,
      });
      // Reset form
      setTitle("");
      setSummary("");
      setGithubLink("");
      setMode("1v1");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Post Challenge</DialogTitle>
          <DialogDescription>
            Create a new coding challenge and compete with other developers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              placeholder="e.g., Algorithm Speed Battle"
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
              placeholder="Describe the challenge, requirements, and success criteria..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              required
              className="professional-input"
            />
          </div>

          <div>
            <Label htmlFor="githubLink" className="flex items-center space-x-2">
              <span>GitHub Repository Link</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Label>
            <Input
              id="githubLink"
              type="url"
              placeholder="https://github.com/username/challenge-repo"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              required
              className="professional-input"
            />
          </div>

          <div>
            <Label htmlFor="mode">Challenger Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="professional-input">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {challengeModes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} Challenge
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Post Challenge
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
