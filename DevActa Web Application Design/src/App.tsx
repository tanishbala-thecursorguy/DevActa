import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navigation } from "./components/Navigation";
import { FuturisticLandingPage } from "./components/FuturisticLandingPage";
import { FuturisticLoginPage } from "./components/FuturisticLoginPage";
import { ProfileSetupSurvey } from "./components/ProfileSetupSurvey";
import { FeedPage } from "./components/FeedPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ArcadeGamesPage } from "./components/ArcadeGamesPage";
import { HackathonsPage } from "./components/HackathonsPage";
import { ChallengesPage } from "./components/ChallengesPage";
import { ProfilePage } from "./components/ProfilePage";
import { HiringPage } from "./components/HiringPage";
import { SettingsPage } from "./components/SettingsPage";
import { RetroGameInterface } from "./components/RetroGameInterface";
import { getCurrentUser, onAuthStateChange, upsertProfile } from "./services/authService";

export default function App() {
  const [appState, setAppState] = useState<'landing' | 'login' | 'survey' | 'app'>('landing');
  const [currentPage, setCurrentPage] = useState("feed");
  const [selectedGame, setSelectedGame] = useState<{ id: number; title: string } | null>(null);
  const [gameState, setGameState] = useState<'games' | 'retro-interface'>('games');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        // User logged in, create/update profile
        try {
          await upsertProfile(user);
          setAppState('survey'); // Go to survey if first time, or app if returning
        } catch (error) {
          console.error('Error upserting profile:', error);
        }
      } else {
        // User logged out
        setAppState('landing');
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setAppState('app'); // If user exists, go straight to app
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setAppState('login');
  };

  const handleLogin = () => {
    // OAuth handled by authService, this is just for navigation
    setAppState('survey');
  };

  const handleSignUp = () => {
    setAppState('survey');
  };

  const handleSurveyComplete = () => {
    setAppState('app');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: string) => {
    console.log("Page changing to:", page);
    setCurrentPage(page);
    // Reset game state when navigating away from games
    if (page !== 'games') {
      setGameState('games');
      setSelectedGame(null);
    }
  };

  const handleGameSelect = (gameId: number, gameTitle: string) => {
    setSelectedGame({ id: gameId, title: gameTitle });
    setGameState('retro-interface');
  };

  const handleBackToGames = () => {
    setGameState('games');
    setSelectedGame(null);
  };

  const handleStartGame = () => {
    // Games now play within the RetroGameInterface, no need to change state
    console.log('Game started within arcade interface');
  };

  const renderPage = () => {
    console.log("Rendering page:", currentPage);
    
    // Handle games page with different states
    if (currentPage === "games") {
      if (gameState === 'retro-interface' && selectedGame) {
        return (
          <RetroGameInterface
            gameTitle={selectedGame.title}
            onBack={handleBackToGames}
            onStartGame={handleStartGame}
          />
        );
      } else {
        return <ArcadeGamesPage onGameSelect={handleGameSelect} />;
      }
    }
    
    // Handle other pages
    switch (currentPage) {
      case "feed":
        return <FeedPage onPageChange={handlePageChange} />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "hackathons":
        return <HackathonsPage />;
      case "challenges":
        return <ChallengesPage />;
      case "profile":
        return <ProfilePage />;
      case "hiring":
        return <HiringPage onPageChange={handlePageChange} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <FeedPage onPageChange={handlePageChange} />;
    }
  };

  // Render based on app state
  if (appState === 'landing') {
    return <FuturisticLandingPage onGetStarted={handleGetStarted} />;
  }

  if (appState === 'login') {
    return <FuturisticLoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  if (appState === 'survey') {
    return <ProfileSetupSurvey onComplete={handleSurveyComplete} />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Only show navigation when not in retro interface */}
        {gameState === 'games' && (
          <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}