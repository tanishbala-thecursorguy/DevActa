import React, { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { signInWithGitHub } from "../services/authService";

interface FuturisticLandingPageProps {
  onGetStarted: () => void;
}

interface VerticalMarqueeProps {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  speed?: number;
  onItemsRef?: (items: HTMLElement[]) => void;
}

function VerticalMarquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 30,
  onItemsRef,
}: VerticalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onItemsRef && containerRef.current) {
      const items = Array.from(containerRef.current.querySelectorAll('.marquee-item')) as HTMLElement[];
      onItemsRef(items);
    }
  }, [onItemsRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group flex flex-col overflow-hidden",
        className
      )}
      style={
        {
          "--duration": `${speed}s`,
        } as React.CSSProperties
      }
    >
      {/* Duplicate content multiple times for seamless infinite scroll */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 flex-col animate-marquee-vertical",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

const marqueeItems = [
  "Game Zone for Developers",
  "Compete in Global Hackathons",
  "Meet New People from Communities",
  "Take on Coding Challenges",
  "Get Hired by Completing Challenges",
  "Show Your Startup",
  "Find Your Startup Team",
  "Post and Earn",
  "Build Devohood",
];

export function FuturisticLandingPage({ onGetStarted }: FuturisticLandingPageProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Lock scroll when landing page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      await signInWithGitHub();
    } catch (error) {
      console.error('GitHub login error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const marqueeContainer = marqueeRef.current;
    if (!marqueeContainer) return;

    const updateOpacity = () => {
      const items = marqueeContainer.querySelectorAll('.marquee-item');
      const containerRect = marqueeContainer.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(centerY - itemCenterY);
        const maxDistance = containerRect.height / 2;
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const opacity = 1 - normalizedDistance * 0.75;
        (item as HTMLElement).style.opacity = opacity.toString();
      });
    };

    const animationFrame = () => {
      updateOpacity();
      requestAnimationFrame(animationFrame);
    };

    const frame = requestAnimationFrame(animationFrame);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 bg-background text-foreground flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="flex flex-col max-w-xl z-20">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="DevActa Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tight text-foreground mb-8">
              DevActa
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Where developers compete, build, and grow together. Join thousands of developers worldwide.
            </p>

                {/* Buttons */}
                <div className="mb-8 space-y-4">
                  <button
                    onClick={handleGitHubLogin}
                    disabled={loading}
                    className="group relative w-full px-8 py-4 bg-gray-900 text-white rounded-md font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="relative z-10">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="relative z-10">Login with GitHub</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  </button>
                  
                  <button
                    onClick={onGetStarted}
                    className="group relative w-full px-8 py-4 bg-black text-white rounded-md font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Continue Without Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  </button>
                </div>

            {/* Footer */}
            <p className="text-sm text-muted-foreground/60">
              Powered by Acta
            </p>
          </div>

          {/* Right Marquee */}
          <div ref={marqueeRef} className="relative h-[600px] lg:h-[700px] flex items-center justify-center z-10">
            <div className="relative w-full h-full">
              <VerticalMarquee speed={20} className="h-full">
                {marqueeItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight py-8 marquee-item whitespace-nowrap"
                  >
                    {item}
                  </div>
                ))}
              </VerticalMarquee>

              {/* Top vignette - maximum fade */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-background from-30% via-background/98 via-50% via-background/85 via-70% to-transparent z-20"></div>

              {/* Bottom vignette - maximum fade */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-background from-30% via-background/98 via-50% via-background/85 via-70% to-transparent z-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}