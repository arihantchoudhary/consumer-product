"use client";

import { useMemo } from "react";

export default function AnimatedBackground() {
  // Generate consistent random values for SSR/client consistency
  const centerWaveData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      height: 30 + (i * 7 + 13) % 40, // Pseudo-random but consistent
      left: 50 + (i - 12.5) * 2.5,
      animationDelay: (i * 137 + 89) % 2000, // Pseudo-random delay
      animationDuration: 0.6 + ((i * 47 + 23) % 80) / 100, // Pseudo-random duration
    }));
  }, []);

  const floatingParticleData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      width: 1 + ((i * 31 + 17) % 400) / 100, // Pseudo-random width 1-5px
      height: 1 + ((i * 41 + 29) % 400) / 100, // Pseudo-random height 1-5px
      left: (i * 73 + 37) % 100, // Pseudo-random left position
      top: (i * 97 + 53) % 100, // Pseudo-random top position
      animationDelay: (i * 151 + 71) % 15000, // Pseudo-random delay up to 15s
      animationDuration: 8000 + ((i * 199 + 113) % 25000), // Pseudo-random duration 8-33s
    }));
  }, []);

  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Giant Sound Waves - Always Active */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Giant Sound Waves */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full flex items-center justify-center"
                style={{
                  width: '100%',
                }}
              >
                <div
                  className="h-full bg-gradient-to-t from-transparent via-blue-500/20 to-transparent animate-soundwave"
                  style={{
                    width: `${3 + i * 0.8}px`,
                    marginLeft: `${i * 80 - 160}px`,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: `${1.5 + i * 0.2}s`,
                  }}
                />
                <div
                  className="h-full bg-gradient-to-t from-transparent via-purple-500/20 to-transparent animate-soundwave"
                  style={{
                    width: `${3 + i * 0.8}px`,
                    marginLeft: `${-i * 80 + 160}px`,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: `${1.5 + i * 0.2}s`,
                  }}
                />
              </div>
            ))}
            
            {/* Center Wave Group */}
            <div className="absolute inset-0 flex items-center justify-center">
              {centerWaveData.map((wave, i) => (
                <div
                  key={`center-${i}`}
                  className="absolute bg-gradient-to-t from-transparent via-red-500/30 to-transparent animate-soundwave-intense"
                  style={{
                    width: '4px',
                    height: `${wave.height}%`,
                    left: `${wave.left}%`,
                    animationDelay: `${wave.animationDelay}ms`,
                    animationDuration: `${wave.animationDuration}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500 opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500 opacity-30 blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 h-60 w-60 rounded-full bg-pink-500 opacity-25 blur-3xl animate-pulse animation-delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500 opacity-25 blur-3xl animate-pulse animation-delay-5000"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {floatingParticleData.map((particle, i) => (
            <div
              key={i}
              className="absolute bg-white/40 rounded-full animate-float"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}ms`,
                animationDuration: `${particle.animationDuration}ms`,
              }}
            />
          ))}
        </div>

        {/* Rotating Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full border border-white/10 animate-spin"
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                animationDuration: `${20 + i * 10}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
              }}
            />
          ))}
        </div>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute rounded-full border-2 border-gradient-to-r from-blue-500/20 to-purple-500/20 animate-ping"
              style={{
                width: `${100 + i * 80}px`,
                height: `${100 + i * 80}px`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '4s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) translateX(-10px) rotate(240deg);
          }
        }

        @keyframes soundwave {
          0%, 100% {
            transform: scaleY(0.3);
            opacity: 0.2;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.6;
          }
        }

        @keyframes soundwave-intense {
          0%, 100% {
            transform: scaleY(0.4);
            opacity: 0.3;
          }
          25% {
            transform: scaleY(1.2);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(0.8);
            opacity: 0.5;
          }
          75% {
            transform: scaleY(1);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-soundwave {
          animation: soundwave ease-in-out infinite;
        }

        .animate-soundwave-intense {
          animation: soundwave-intense ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-5000 {
          animation-delay: 5s;
        }
      `}</style>
    </>
  );
}