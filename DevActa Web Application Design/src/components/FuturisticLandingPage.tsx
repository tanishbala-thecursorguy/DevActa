import React, { ReactNode, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

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