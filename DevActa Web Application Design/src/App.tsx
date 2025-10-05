import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider, useUser, UserProfile } from "./contexts/UserContext";
import { Navigation } from "./components/Navigation";
import { FuturisticLandingPage } from "./components/FuturisticLandingPage";
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
import { getCurrentUser, onAuthStateChange, upsertProfile, getProfile } from "./services/authService";

function AppContent() {
  const [appState, setAppState] = useState<'landing' | 'survey' | 'app'>('landing');
  const [currentPage, setCurrentPage] = useState("feed");
  const [selectedGame, setSelectedGame] = useState<{ id: number; title: string } | null>(null);
  const [gameState, setGameState] = useState<'games' | 'retro-interface'>('games');
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const { setUserProfile } = useUser();

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = onAuthStateChange(async (user) => {
      setAuthUser(user);
      if (user) {
        try {
          // Create/update profile in Supabase
          await upsertProfile(user);
          
          // Get full profile data
          const profile = await getProfile(user.id);
          
          // Check if user has completed survey (has first_name)
          if (profile && profile.first_name) {
            // User has completed profile, go to app
            setUserProfile({
              username: profile.github_username,
              firstName: profile.first_name,
              lastName: profile.last_name,
              bio: profile.bio,
              profilePicture: profile.profile_pic_url,
              githubLink: profile.github_url,
              linkedinLink: profile.linkedin_url || '',
              otherSocials: [],
              trophies: 0,
            });
            setAppState('app');
          } else {
            // User logged in but hasn't completed survey
            setAppState('survey');
          }
        } catch (error) {
          console.error('Error handling auth:', error);
          setAppState('survey');
        }
      } else {
        setAppState('landing');
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUserProfile]);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setAuthUser(user);
        const profile = await getProfile(user.id);
        if (profile && profile.first_name) {
          setUserProfile({
            username: profile.github_username,
            firstName: profile.first_name,
            lastName: profile.last_name,
            bio: profile.bio,
            profilePicture: profile.profile_pic_url,
            githubLink: profile.github_url,
            linkedinLink: profile.linkedin_url || '',
            otherSocials: [],
            trophies: 0,
          });
          setAppState('app');
        } else {
          setAppState('survey');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setAppState('survey');
  };

  const handleProfileComplete = async (profileData: UserProfile) => {
    setUserProfile(profileData);
    
    // Save to Supabase if user is authenticated
    if (authUser) {
      try {
        const { supabaseAuth } = await import("../lib/supabase");
        await supabaseAuth.from('profiles').update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          bio: profileData.bio,
          profile_pic_url: profileData.profilePicture,
          linkedin_url: profileData.linkedinLink,
        }).eq('auth_uid', authUser.id);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
    
    setAppState('app');
  };

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

  // Render based on app state
  if (appState === 'landing') {
    return <FuturisticLandingPage onGetStarted={handleGetStarted} />;
  }

  if (appState === 'survey') {
    return <ProfileSetupSurvey onComplete={handleProfileComplete} authUser={authUser} />;
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

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}