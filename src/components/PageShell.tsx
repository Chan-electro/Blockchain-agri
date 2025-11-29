import React, { useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Sparkles, Rocket, Orbit, ShieldCheck } from 'lucide-react';

interface PageShellProps {
  children: React.ReactNode;
}

const accentIcons = [Sparkles, Rocket, Orbit, ShieldCheck];

const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const location = useLocation();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const iconPositions = useMemo(
    () => [
      { top: '12%', left: '8%' },
      { top: '18%', right: '12%' },
      { bottom: '18%', left: '14%' },
      { bottom: '12%', right: '10%' },
    ],
    []
  );

  useGSAP(() => {
    if (!shellRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      glowRefs.current.forEach((node, index) => {
        if (!node) return;
        gsap.to(node, {
          scale: 1.15,
          opacity: 0.8,
          rotate: index % 2 === 0 ? 6 : -6,
          duration: 6 + index,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      const iconElements = gsap.utils.toArray<HTMLElement>('.page-shell__icon');
      gsap.to(iconElements, {
        y: 'random(-10, 10)',
        x: 'random(-6, 6)',
        rotate: 'random(-6, 6)',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });
    }, shellRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(52,211,153,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.18),transparent_35%)]" />
        {iconPositions.map((position, index) => {
          const Icon = accentIcons[index];
          return (
            <div
              key={index}
              className="page-shell__icon absolute text-primary/30"
              style={position as React.CSSProperties}
            >
              <Icon size={32} />
            </div>
          );
        })}
        <div className="absolute inset-10">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              ref={(node) => {
                glowRefs.current[index] = node;
              }}
              className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              style={{
                top: `${index * 20 + 10}%`,
                left: index === 2 ? '60%' : `${index * 30 + 5}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="backdrop-blur-[2px]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageShell;
