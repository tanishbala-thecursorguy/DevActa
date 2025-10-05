"use client";

import { cn } from "../lib/utils";
import { ReactNode, useEffect, useRef } from "react";

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

  // Lock scroll when landing page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='none'/%3E%3Cg transform='translate(250,250)'%3E%3C!-- Glasses --%3E%3Cpath d='M-150,-20 Q-150,-60 -110,-60 L-50,-60 Q-10,-60 -10,-20 L-10,20 Q-10,60 -50,60 L-110,60 Q-150,60 -150,20 Z' fill='none' stroke='%23000' stroke-width='12'/%3E%3Cpath d='M10,-20 Q10,-60 50,-60 L110,-60 Q150,-60 150,-20 L150,20 Q150,60 110,60 L50,60 Q10,60 10,20 Z' fill='none' stroke='%23000' stroke-width='12'/%3E%3Cline x1='-10' y1='0' x2='10' y2='0' stroke='%23000' stroke-width='12'/%3E%3C!-- Code brackets in left lens --%3E%3Ctext x='-105' y='15' font-size='50' fill='%2300ff00' font-family='monospace' font-weight='bold'%3E%7B%3C/text%3E%3Ctext x='-55' y='15' font-size='50' fill='%2300ff00' font-family='monospace' font-weight='bold'%3E%7D%3C/text%3E%3C!-- Code brackets in right lens --%3E%3Ctext x='55' y='15' font-size='50' fill='%2300ff00' font-family='monospace' font-weight='bold'%3E%7B%3C/text%3E%3Ctext x='105' y='15' font-size='50' fill='%2300ff00' font-family='monospace' font-weight='bold'%3E%7D%3C/text%3E%3C!-- Cursor arrows --%3E%3Cpolygon points='-90,-10 -70,0 -90,10' fill='%23000'/%3E%3Cpolygon points='90,-10 110,0 90,10' fill='%23000'/%3E%3C/g%3E%3C/svg%3E" 
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
            
            {/* Button */}
            <div className="mb-8">
              <button 
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-black text-white rounded-md font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Get Started</span>
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
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight py-4 marquee-item whitespace-nowrap"
                  >
                    {item}
                  </div>
                ))}
              </VerticalMarquee>
              
              {/* Top vignette */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-background via-background/50 to-transparent z-20"></div>
              
              {/* Bottom vignette */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/50 to-transparent z-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}