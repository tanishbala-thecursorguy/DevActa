import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import logoImage from "figma:asset/32a9f97ebfa773dabe97368d7e406f5ed1e26205.png";

interface FuturisticLoginPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function FuturisticLoginPage({ onLogin, onSignUp }: FuturisticLoginPageProps) {
  const [isHiringPerson, setIsHiringPerson] = useState(false);

  return (
    <div className="professional-landing min-h-screen relative overflow-hidden">
      {/* Professional Grid Background */}
      <div className="landing-grid-background"></div>
      
      {/* Gradient Overlay */}
      <div className="landing-gradient-overlay"></div>
      
      {/* Floating Dots Animation */}
      <div className="landing-dots-container">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="landing-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Split Screen Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen relative z-10">
        
        {/* Left Side - Professional Branding */}
        <div className="hidden lg:flex items-center justify-center relative bg-gradient-to-br from-white to-slate-50">
          {/* Center Logo */}
          <div className="text-center">
            <div className="logo-professional mb-8">
              <img 
                src={logoImage} 
                alt="DevArena" 
                className="w-40 h-40 mx-auto object-contain"
              />
            </div>
            <h1 className="professional-title text-6xl mb-4">
              Dev<span style={{ color: '#0A66C2' }}>Acta</span>
            </h1>
            <p className="professional-subtitle text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Where developers connect, compete, and get hired
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            
            {/* Logo for mobile */}
            <div className="lg:hidden mb-8 text-center">
              <img 
                src={logoImage} 
                alt="DevArena" 
                className="w-20 h-20 mx-auto object-contain mb-4"
              />
              <h1 className="professional-title text-3xl">
                Dev<span style={{ color: '#0A66C2' }}>Acta</span>
              </h1>
            </div>

            {/* Login Box */}
            <div className="professional-feature-card p-8 space-y-6 border-2">
              <div className="text-center mb-8">
                <h2 className="text-3xl mb-2 text-gray-900">Login to DevActa</h2>
                <p className="text-gray-600">Choose your login method</p>
              </div>

              {/* Login Buttons */}
              <div className="space-y-4">
                {/* GitHub Login */}
                <Button
                  onClick={onLogin}
                  className="w-full professional-button-primary py-6 text-lg group bg-gray-900 hover:bg-gray-800"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="flex-1">Continue with GitHub</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Button>

                {/* Hiring Person Checkbox */}
                <div className="flex items-center space-x-3 py-2">
                  <Checkbox
                    id="hiring"
                    checked={isHiringPerson}
                    onCheckedChange={(checked) => setIsHiringPerson(checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor="hiring"
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    I am a Hiring Person
                  </label>
                </div>

                {/* LinkedIn Login - Conditional */}
                {isHiringPerson && (
                  <Button
                    onClick={onLogin}
                    className="w-full professional-button-cta py-6 text-lg group slide-in-down"
                  >
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="flex-1">Continue with LinkedIn</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Button>
                )}
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onSignUp}
                    className="text-primary hover:text-primary/80 transition-colors relative"
                  >
                    Sign up
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 hover:w-full"></span>
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Powered by <span className="text-primary font-semibold">Acta</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
