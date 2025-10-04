import { useEffect } from "react";
import { Button } from "./ui/button";
import logoImage from "figma:asset/32a9f97ebfa773dabe97368d7e406f5ed1e26205.png";

interface FuturisticLandingPageProps {
  onGetStarted: () => void;
}

export function FuturisticLandingPage({ onGetStarted }: FuturisticLandingPageProps) {
  useEffect(() => {
    // Create subtle animated dots
    const container = document.getElementById('landing-dots-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('div');
      dot.className = 'landing-dot';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dot.style.animationDuration = `${Math.random() * 3 + 3}s`;
      container.appendChild(dot);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const features = [
    { 
      icon: "🎮", 
      title: "Game Zone for Developers",
      text: "Play retro arcade games, compete in challenges, and get discovered by top companies looking for talented developers",
      delay: 0.2 
    },
    { 
      icon: "🏆", 
      title: "Compete in Global Hackathons",
      text: "Join exciting hackathons with real prizes, build innovative projects, and showcase your skills to the world",
      delay: 0.4 
    },
    { 
      icon: "👥", 
      title: "Meet New People from Communities",
      text: "Connect with developers worldwide, join communities, share knowledge, and grow your professional network",
      delay: 0.6 
    },
    { 
      icon: "⚔️", 
      title: "Take on Coding Challenges",
      text: "Test your skills in 1v1 battles, team challenges, and prove your expertise on the leaderboard",
      delay: 0.8 
    },
  ];

  return (
    <div className="professional-landing min-h-screen relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="landing-grid-background"></div>
      
      {/* Animated Dots */}
      <div id="landing-dots-container" className="landing-dots-container"></div>

      {/* Subtle Gradient Overlay */}
      <div className="landing-gradient-overlay"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Logo & Branding */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative mb-8">
                {/* Logo */}
                <div className="logo-professional">
                  <img 
                    src={logoImage} 
                    alt="DevActa Logo" 
                    className="w-48 h-48 object-contain hover-lift"
                  />
                </div>
              </div>

              {/* Brand Title */}
              <div className="mb-6">
                <h1 className="professional-title text-6xl lg:text-7xl mb-4">
                  Dev<span className="text-primary">Acta</span>
                </h1>
                <div className="professional-subtitle text-xl text-gray-600">
                  Developer Community Platform
                </div>
              </div>

              {/* Tagline */}
              <p className="text-2xl text-gray-700 mb-8 max-w-lg leading-relaxed">
                Where developers <span className="text-primary font-semibold">compete</span>, 
                {' '}<span className="text-primary font-semibold">build</span>, and 
                {' '}<span className="text-primary font-semibold">grow</span> together
              </p>

              {/* CTA Button */}
              <div className="professional-cta">
                <Button
                  onClick={onGetStarted}
                  className="professional-button-cta text-xl px-12 py-6"
                  size="lg"
                >
                  Get Started
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Join thousands of developers worldwide
                </p>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="professional-feature-card"
                  style={{ animationDelay: `${feature.delay}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="professional-feature-icon">
                      <span className="text-4xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-sm text-gray-500">
              Powered by <span className="text-primary font-semibold">Acta</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
