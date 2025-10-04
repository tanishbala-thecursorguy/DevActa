-- =====================================================
-- DEVACTA SUPABASE DATABASE SCHEMA
-- Gaming Platform with Social Features
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & PROFILES
-- =====================================================

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  website TEXT,
  github_username VARCHAR(100),
  linkedin_url TEXT,
  twitter_username VARCHAR(100),
  
  -- Gaming Stats
  total_points INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  
  -- Developer Info
  skill_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  primary_language VARCHAR(50),
  years_of_experience INTEGER,
  looking_for_work BOOLEAN DEFAULT false,
  
  -- Preferences
  theme VARCHAR(20) DEFAULT 'dark', -- dark, light, system
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills (Many-to-Many)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20), -- beginner, intermediate, advanced, expert
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GAMES
-- =====================================================

-- Games Table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail TEXT, -- emoji or image URL
  difficulty VARCHAR(20) NOT NULL, -- easy, medium, hard, expert
  category VARCHAR(50), -- puzzle, arcade, strategy, coding
  
  -- Game Settings
  time_limit INTEGER, -- in seconds
  max_score INTEGER,
  reward_points INTEGER DEFAULT 10,
  
  -- Metadata
  play_count INTEGER DEFAULT 0,
  average_score DECIMAL(10, 2) DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Scores / Play History
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  score INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  completed BOOLEAN DEFAULT false,
  points_earned INTEGER DEFAULT 0,
  
  -- Game-specific data (JSON)
  game_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for leaderboards
CREATE INDEX idx_game_scores_leaderboard ON game_scores(game_id, score DESC, time_taken ASC);
CREATE INDEX idx_user_scores ON game_scores(user_id, created_at DESC);

-- =====================================================
-- HACKATHONS
-- =====================================================

-- Hackathons Table
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  banner_image TEXT,
  
  -- Timing
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  
  -- Details
  organizer VARCHAR(255),
  location VARCHAR(255), -- or "Virtual"
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  
  -- Prizes & Requirements
  prize_pool VARCHAR(100),
  requirements TEXT,
  themes TEXT[], -- array of themes
  tech_stack TEXT[], -- suggested technologies
  
  -- Links
  website_url TEXT,
  discord_url TEXT,
  rules_url TEXT,
  
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hackathon Registrations
CREATE TABLE hackathon_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  team_name VARCHAR(255),
  team_size INTEGER DEFAULT 1,
  project_idea TEXT,
  
  status VARCHAR(20) DEFAULT 'registered', -- registered, submitted, winner
  submission_url TEXT,
  submission_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(hackathon_id, user_id)
);

-- =====================================================
-- CHALLENGES
-- =====================================================

-- Coding Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  problem_statement TEXT NOT NULL,
  
  difficulty VARCHAR(20) NOT NULL, -- easy, medium, hard
  category VARCHAR(50), -- algorithms, data-structures, frontend, backend
  tags TEXT[],
  
  -- Challenge Details
  starter_code TEXT,
  test_cases JSONB, -- array of test cases
  time_limit INTEGER, -- in seconds
  memory_limit INTEGER, -- in MB
  
  -- Rewards
  points INTEGER DEFAULT 50,
  
  -- Stats
  total_attempts INTEGER DEFAULT 0,
  successful_completions INTEGER DEFAULT 0,
  average_time INTEGER,
  
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Submissions
CREATE TABLE challenge_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, passed, failed
  test_results JSONB,
  execution_time INTEGER, -- in ms
  memory_used INTEGER, -- in KB
  
  points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenge_submissions ON challenge_submissions(challenge_id, user_id, created_at DESC);

-- =====================================================
-- SOCIAL FEATURES
-- =====================================================

-- Posts (Feed)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  images TEXT[], -- array of image URLs
  code_snippet TEXT,
  language VARCHAR(50), -- for syntax highlighting
  
  -- Post Type
  post_type VARCHAR(20) DEFAULT 'general', -- general, achievement, project, question
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Visibility
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_feed ON posts(created_at DESC) WHERE is_deleted = false;

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested comments
  
  content TEXT NOT NULL,
  
  likes_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at ASC) WHERE is_deleted = false;

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Polymorphic-like structure
  likeable_type VARCHAR(20) NOT NULL, -- post, comment, challenge
  likeable_id UUID NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_lookup ON likes(likeable_type, likeable_id);

-- Follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

-- Achievements Definition
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  category VARCHAR(50), -- gaming, coding, social, streak
  
  -- Requirements
  requirement_type VARCHAR(50), -- score, games_played, challenges_completed, streak
  requirement_value INTEGER,
  
  points INTEGER DEFAULT 10,
  rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- HIRING & JOBS
-- =====================================================

-- Job Postings
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  company_logo TEXT,
  
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  
  -- Job Details
  job_type VARCHAR(50), -- full-time, part-time, contract, internship
  experience_level VARCHAR(50), -- entry, mid, senior, lead
  location VARCHAR(255),
  remote BOOLEAN DEFAULT false,
  salary_range VARCHAR(100),
  
  -- Tech Stack
  required_skills TEXT[],
  preferred_skills TEXT[],
  
  -- Application
  application_url TEXT,
  application_email VARCHAR(255),
  
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  posted_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_jobs_active ON jobs(created_at DESC) WHERE is_active = true;

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  
  status VARCHAR(20) DEFAULT 'applied', -- applied, reviewing, interview, rejected, accepted
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(job_id, user_id)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- like, comment, follow, achievement, hackathon
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Related Entity
  related_type VARCHAR(50),
  related_id UUID,
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- =====================================================
-- LEADERBOARDS (Materialized View for Performance)
-- =====================================================

CREATE MATERIALIZED VIEW global_leaderboard AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.total_points,
  p.games_played,
  p.achievements_count,
  p.current_streak,
  RANK() OVER (ORDER BY p.total_points DESC) as rank
FROM profiles p
ORDER BY p.total_points DESC
LIMIT 100;

CREATE UNIQUE INDEX idx_global_leaderboard ON global_leaderboard(id);

-- Refresh function for leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY global_leaderboard;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Game Scores: Public read, users can insert their own
CREATE POLICY "Game scores are viewable by everyone" ON game_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert own scores" ON game_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Posts: Public read, users can manage their own
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (is_deleted = false);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments: Public read, users can manage their own
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (is_deleted = false);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes: Users can manage their own
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment likes count
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.likeable_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.likeable_id;
  ELSIF NEW.likeable_type = 'comment' THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.likeable_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_likes AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION increment_likes_count();

-- Decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.likeable_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.likeable_id;
  ELSIF OLD.likeable_type = 'comment' THEN
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.likeable_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_likes AFTER DELETE ON likes FOR EACH ROW EXECUTE FUNCTION decrement_likes_count();

-- Update profile points when game score is added
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_points = total_points + NEW.points_earned,
    games_played = games_played + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points AFTER INSERT ON game_scores FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert some sample games
INSERT INTO games (title, description, thumbnail, difficulty, category, time_limit, reward_points) VALUES
('Snake', 'Classic snake game - eat food and grow longer', '🐍', 'easy', 'arcade', 600, 10),
('Tetris', 'Stack blocks to clear lines', '🧱', 'medium', 'puzzle', 600, 15),
('Memory Match', 'Find matching pairs of cards', '🎴', 'easy', 'puzzle', 300, 10),
('Code Quiz', 'Test your programming knowledge', '💻', 'medium', 'coding', 900, 20),
('Speed Typing', 'Type as fast as you can', '⌨️', 'easy', 'arcade', 120, 10);

-- Insert sample achievements
INSERT INTO achievements (title, description, icon, category, requirement_type, requirement_value, points, rarity) VALUES
('First Steps', 'Play your first game', '🎮', 'gaming', 'games_played', 1, 10, 'common'),
('Getting Started', 'Play 10 games', '🎯', 'gaming', 'games_played', 10, 25, 'common'),
('Game Master', 'Play 100 games', '👑', 'gaming', 'games_played', 100, 100, 'rare'),
('Score Hunter', 'Reach 1000 points', '💯', 'gaming', 'score', 1000, 50, 'rare'),
('Week Warrior', '7-day streak', '🔥', 'streak', 'streak', 7, 75, 'epic'),
('Coder', 'Complete your first challenge', '💻', 'coding', 'challenges_completed', 1, 20, 'common');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_points ON profiles(total_points DESC);
CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id, created_at DESC);
CREATE INDEX idx_games_active ON games(is_active, play_count DESC);
CREATE INDEX idx_hackathons_dates ON hackathons(start_date, end_date);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty, category);
CREATE INDEX idx_jobs_location ON jobs(location, remote) WHERE is_active = true;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Grant necessary permissions (adjust as needed)
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
