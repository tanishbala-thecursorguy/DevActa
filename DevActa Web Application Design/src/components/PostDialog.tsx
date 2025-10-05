import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: (data: { title: string; description: string; githubLink: string }) => void;
}

export function PostDialog({ open, onOpenChange, onPost }: PostDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && githubLink) {
      onPost({ title, description, githubLink });
      setTitle("");
      setDescription("");
      setGithubLink("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Share Your Project</DialogTitle>
          <DialogDescription>
            Share your latest project with the DevArena community. Include your project details and GitHub repository link.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., WeatherApp API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Project Summary</Label>
            <Textarea
              id="description"
              placeholder="Write a brief summary of your project, its features, and technologies used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub Repository Link</Label>
            <Input
              id="github"
              placeholder="https://github.com/username/repo-name"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
            >
              Post Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}