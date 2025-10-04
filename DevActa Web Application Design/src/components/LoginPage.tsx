import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const handleGitHubLogin = () => {
    // For now, just simulate login - in real app this would connect to GitHub OAuth
    console.log("GitHub login would happen here");
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl text-primary mb-2">DevArena</h1>
            <p className="text-muted-foreground">Connect. Code. Compete.</p>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl mb-3">Welcome to DevArena</h2>
            <p className="text-muted-foreground">
              Join the community of developers showcasing their projects and leveling up their skills.
            </p>
          </div>

          {/* GitHub Login */}
          <div className="space-y-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center space-x-3"
              size="lg"
              onClick={handleGitHubLogin}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Continue with GitHub</span>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Only developers with GitHub accounts can join DevArena
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">📁</div>
                <p className="text-xs text-muted-foreground">Showcase Projects</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs text-muted-foreground">Earn Trophies</p>
              </div>
              <div>
                <div className="text-2xl mb-1">💼</div>
                <p className="text-xs text-muted-foreground">Get Hired</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}