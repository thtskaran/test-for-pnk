// src/components/FinalLetter.tsx
import { useEffect, useRef, useState } from "react";
import { useConfig } from "../utils/configHandler";

interface FinalLetterProps {
  onRestart: () => void;
}

export default function FinalLetter({ onRestart }: FinalLetterProps) {
  const { config, loading } = useConfig();
  const [showSealing, setShowSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const typingTextRef = useRef("");
  const [typedText, setTypedText] = useState("");
  const typingTimerRef = useRef<number | null>(null);

  // kiss animation state: store an array of kiss particles to render
  const [kisses, setKisses] = useState<
    { id: number; left: number; delay: number; size: number; rotation: number }[]
  >([]);
  const kissIdRef = useRef(0);

  useEffect(() => {
    if (config) {
      typingTextRef.current = config.finalLetter.typedDefault;
    }
  }, [config]);

  // typing for signature
  useEffect(() => {
    if (!isSealed) {
      setTypedText("");
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }
    const str = typingTextRef.current;
    let i = 0;
    typingTimerRef.current = window.setInterval(() => {
      i += 1;
      setTypedText(str.slice(0, i));
      if (i >= str.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 45);
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isSealed]);

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const sealLetter = () => {
    setShowSealing(true);
    setTimeout(() => {
      setIsSealed(true);
      setShowSealing(false);
    }, 1400);
  };

  const sendKiss = () => {
    // generate 10 kisses with varied x positions, sizes, delays and small rotations
    const batch: typeof kisses = [];
    for (let i = 0; i < 10; i++) {
      const id = ++kissIdRef.current;
      batch.push({
        id,
        left: 8 + Math.random() * 84, // percent
        delay: i * 80 + Math.random() * 120, // ms
        size: 18 + Math.round(Math.random() * 18), // px (emoji size)
        rotation: -20 + Math.random() * 40, // deg
      });
    }
    setKisses((s) => [...s, ...batch]);

    // cleanup kisses after animation (2.2s + max delay)
    const maxDelay = Math.max(...batch.map((k) => k.delay));
    setTimeout(() => {
      setKisses((s) => s.filter((k) => !batch.find((b) => b.id === k.id)));
    }, 2200 + maxDelay);
  };

  return (
    <>
      <main className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="text-center mb-12 relative z-10">
          <span className="block text-retro-pink font-hand text-2xl rotate-[-2deg] mb-2">
            the grand finale...
          </span>
          <h1 className="text-4xl md:text-6xl font-display text-primary drop-shadow-sm tracking-tight leading-tight">
            {config.finalLetter.title}
          </h1>
        </div>

        <div className="w-full max-w-4xl bg-note-pink/95 backdrop-blur-sm rounded-2xl p-8 shadow-retro border-2 border-primary/30">
          {!isSealed ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-retro">
                  <span className="material-icons-round">mail</span>
                </div>
                <h3 className="text-2xl font-display text-primary">
                  Final Love Letter
                </h3>
              </div>

              <div className="bg-white/60 rounded-xl p-6 font-hand text-lg leading-relaxed space-y-4 text-gray-800 border border-primary/20">
                <p className="text-primary font-bold text-xl">
                  {config.finalLetter.letterGreeting}
                </p>

                <p className="text-gray-700">{config.finalLetter.letterParagraphs[0]}</p>
                <p className="text-gray-700 font-medium">
                  {config.finalLetter.letterParagraphs[1]}
                </p>
                <p className="text-gray-700">{config.finalLetter.letterParagraphs[2]}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center pt-4">
                <div className="text-sm text-gray-600 font-hand">
                  {config.finalLetter.sealingNote}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => sealLetter()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                  >
                    {config.finalLetter.sealButton}
                    <span className="material-icons-round">favorite</span>
                  </button>

                  <button
                    onClick={onRestart}
                    className="px-6 py-3 rounded-full bg-retro-green text-white font-bold shadow-retro hover:shadow-retro-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                  >
                    {config.finalLetter.restartButton}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-retro-pink to-retro-yellow flex items-center justify-center shadow-retro">
                <div className="text-5xl">💝</div>
              </div>

              <div>
                <h2 className="text-3xl font-display text-primary mb-2">
                  {config.finalLetter.sealedTitle}
                </h2>
                <p className="text-lg text-gray-600 font-body">
                  {config.finalLetter.sealedSubtitle}
                </p>
              </div>

              <div className="flex justify-center gap-2 my-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-icons-round text-2xl text-primary animate-pulse"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    favorite
                  </span>
                ))}
              </div>

              <div className="bg-note-pink/30 rounded-xl p-6 mb-6">
                <div className="text-2xl font-hand text-primary mb-2">
                  {typedText || config.finalLetter.typedDefault}
                </div>
                <div className="text-sm text-gray-500 font-body">
                  {new Date().toLocaleDateString(
                    config.finalLetter.dateLocale,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={onRestart}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                >
                  {config.finalLetter.experienceAgain}
                  <span className="material-icons-round">refresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* kiss particles (improved animation) */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {kisses.map((k) => (
          <div
            key={k.id}
            className="kiss-particle"
            style={{
              left: `${k.left}%`,
              bottom: 12,
              fontSize: k.size,
              transform: `translateX(-50%) rotate(${k.rotation}deg)`,
              animationDelay: `${k.delay}ms`,
            }}
          >
            <span className="block">💋</span>
            <span className="sparkle" />
          </div>
        ))}
      </div>

      {/* sealing overlay */}
      {showSealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff0f4]/75">
          <div className="flex flex-col items-center gap-3">
            <div className="text-7xl animate-seal-spin">💌</div>
            <div className="text-sm text-gray-600">
              {config.finalLetter.sealingText}
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles - Now correctly inside the main wrapper */}
      <style>{`
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-seal-spin { animation: spinSeal 1.4s ease-in-out; }
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spinSeal {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }

        /* Kiss particle animations */
        .kiss-particle {
          position: absolute;
          bottom: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: center;
          will-change: transform, opacity;
          animation: kissRise 1600ms cubic-bezier(.2,.8,.2,1) forwards;
        }
        .kiss-particle .sparkle {
          width: 8px;
          height: 8px;
          margin-top: 6px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 40%, transparent 60%);
          border-radius: 50%;
          opacity: 0.9;
          transform-origin: center;
          animation: sparklePop 800ms ease-out forwards;
        }

        @keyframes kissRise {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.9);
            opacity: 0.95;
          }
          30% {
            transform: translateY(-30px) translateX(var(--driftX, 0px)) rotate(var(--rot, 0deg)) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateY(-140px) translateX(var(--driftX, 0px)) rotate(calc(var(--rot, 0deg) * 1.3)) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes sparklePop {
          0% { transform: scale(0.6); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
}