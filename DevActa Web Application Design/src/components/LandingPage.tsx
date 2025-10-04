import { Button } from "./ui/button";

interface LandingPageProps {
  onPageChange: (page: string) => void;
}

export function LandingPage({ onPageChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl mb-6 text-foreground">
            Showcase Your Projects.<br />
            Level Up Your Skills.<br />
            Get Hired.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload your GitHub repos, earn reviews, climb the leaderboard, and unlock opportunities.
            Connect with fellow developers and showcase your coding expertise to top employers.
          </p>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg"
            onClick={() => onPageChange("feed")}
          >
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl mb-3 text-foreground">Showcase Projects</h3>
            <p className="text-muted-foreground">
              Connect your GitHub repositories and let other developers discover and review your work.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl mb-3 text-foreground">Earn Trophies</h3>
            <p className="text-muted-foreground">
              Complete challenges, receive positive reviews, and climb the developer leaderboard.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
              </svg>
            </div>
            <h3 className="text-xl mb-3 text-foreground">Get Hired</h3>
            <p className="text-muted-foreground">
              Connect with recruiters and companies looking for talented developers like you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}