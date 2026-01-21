import React, { useEffect, useState } from "react";
import { useConfig, getImageSrc } from "../utils/configHandler";

type Props = {
  onEnter?: () => void;
  herName?: string;
  yourName?: string;
  gifSrc?: string;
};

const LandingPage: React.FC<Props> = ({
  onEnter,
  gifSrc,
}) => {
  const { config, loading } = useConfig();
  const [typedText, setTypedText] = useState("");

  const handleEnter = () => {
    if (onEnter) onEnter();
    else {
      const el = document.getElementById("activity");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else console.log("Click to Begin pressed!");
    }
  };

  // Typing effect for last line
  useEffect(() => {
    if (!config) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(config.landing.lastLine.slice(0, i));
      i++;
      if (i > config.landing.lastLine.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [config]);

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const gifUrl = gifSrc || getImageSrc(config.landing.images.background);
  const introImg = getImageSrc(config.landing.images.buttonIcon);

  return (
    <>
      <main className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
          {/* Floating decorative elements */}
          <div className="absolute top-20 left-12 w-8 h-8 bg-retro-yellow rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-retro-pink rounded-full opacity-50 animate-float-slow"></div>
          <div className="absolute bottom-32 left-8 w-6 h-6 bg-retro-green rounded-full opacity-70 animate-float"></div>

          <div className="text-center mb-16 relative z-10">
            <span className="block text-retro-pink font-hand text-2xl rotate-[-2deg] mb-4">{config.landing.welcome}</span>
            <h1 className="text-5xl md:text-8xl font-display text-primary drop-shadow-sm tracking-tight leading-tight mb-6">
              {config.landing.title}
            </h1>
            
            <div className="relative bg-note-green/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-retro border-2 border-primary/30">
              {/* MacBook-style dots */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer shadow-sm"></div>
              </div>

              {/* Intro GIF at top right */}
              <div className="absolute -top-12 -right-8">
                <img
                  src={gifUrl}
                  alt="cute animation"
                  className="w-28 h-28 object-contain animate-float"
                />
              </div>

              <div className="text-gray-700 text-lg leading-relaxed mb-6 mt-4">
                <p className="font-body">{config.landing.subtitle}</p>
                <p className="pt-4 font-hand text-xl">
                  <span className="text-primary">{typedText}</span>
                  <span className="inline-block w-1.5 h-5 bg-primary ml-1 animate-pulse" />
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleEnter}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg"
              >
                {config.landing.button}
                <span className="material-icons-round">arrow_forward</span>
              </button>

              {/* Intro PNG above card at bottom left with tilt */}
              <div className="absolute -bottom-6 -left-4">
                <img
                  src={introImg}
                  alt="Decorative"
                  className="w-20 h-auto object-contain animate-float-slow transform -rotate-12"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-4 text-center text-sm text-gray-500 font-hand">
          {config.landing.footer}
        </footer>

        {/* Custom Styles */}
        <style>{`
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        `}</style>
    </>
  );
};

export default LandingPage;
