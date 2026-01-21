import { useState } from "react";
import { motion } from "framer-motion";
import { useConfig, getImageSrc } from "../utils/configHandler";

interface ActivityPageProps {
  onNext?: () => void;
}

export default function ActivityPage({
  onNext
}: ActivityPageProps) {
  const { config, loading } = useConfig();
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Get the letter content from config
  const greeting = config.letter.letterGreeting || "Hey love,";
  const bodyContent = config.letter.letterMessage;
  const signature = config.letter.letterSignature;
  const letterImg = getImageSrc(config.letter.images.envelope);

  // Handle envelope opening
  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      // Show letter after envelope animation
      setTimeout(() => {
        setShowLetter(true);
        // Start typing animation for signature after a short delay
        setTimeout(() => {
          startTypingSignature();
        }, 500);
      }, 800);
    }
  };

  // Typing animation for the signature
  const startTypingSignature = () => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedSignature(signature.slice(0, i));
      i++;
      if (i > signature.length) {
        clearInterval(interval);
        setTimeout(() => setShowContinue(true), 500);
      }
    }, 50);
  };

  // Add sparkles on hover
  const addSparkle = (e: React.MouseEvent) => {
    if (isEnvelopeOpen) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y
    };
    
    setSparkles(prev => [...prev, newSparkle]);
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  };

  return (
    <>
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center"
      >
          {/* Decorative elements */}
          <div className="absolute top-20 left-12 w-8 h-8 bg-retro-yellow rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-retro-pink rounded-full opacity-50 animate-float-slow"></div>
          <div className="absolute bottom-32 left-8 w-6 h-6 bg-retro-green rounded-full opacity-70 animate-float"></div>

          <div className="text-center mb-6 md:mb-8 relative z-10">
            <span className="block text-retro-pink font-hand text-2xl rotate-[-2deg] mb-2">{config.letter.headerSubtitle}</span>
            <h1 className="text-3xl md:text-6xl font-display text-primary drop-shadow-sm tracking-tight leading-tight">
              {config.letter.headerTitle}
            </h1>
          </div>

          <div className="w-full max-w-4xl bg-note-yellow/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-retro border-2 border-primary/30">
          
          {!showLetter ? (
            /* Envelope Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[350px] md:min-h-[400px] relative"
            >
              <div 
                className={`relative cursor-pointer transition-all duration-800 transform ${
                  isEnvelopeOpen ? 'scale-110 rotate-2' : 'hover:scale-105 hover:-rotate-1'
                }`}
                onClick={handleEnvelopeClick}
                onMouseMove={addSparkle}
              >
                {/* Sparkles */}
                {sparkles.map(sparkle => (
                  <div
                    key={sparkle.id}
                    className="absolute pointer-events-none text-yellow-400 animate-sparkle-pop"
                    style={{
                      left: sparkle.x,
                      top: sparkle.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    ✨
                  </div>
                ))}

                {/* Envelope */}
                <div className="relative w-80 h-56 mx-auto transition-all duration-500 hover:scale-105">
                  {/* Envelope Body */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE0] to-[#E8D4A0] rounded-lg shadow-lg border-2 border-primary/30" />
                  
                  {/* Envelope Flap */}
                  <div 
                    className={`absolute -top-1 left-0 right-0 h-28 bg-gradient-to-br from-[#D4A574] to-[#B8845F] transition-all duration-1000 ease-out origin-top ${
                      isEnvelopeOpen ? '-rotate-180 translate-y-4' : ''
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      borderRadius: '8px 8px 0 0'
                    }}
                  />

                  {/* Wax Seal */}
                  {!isEnvelopeOpen && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-primary to-retro-pink rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse hover:scale-110 transition-transform">
                      💌
                    </div>
                  )}

                  {/* Letter peeking out */}
                  {isEnvelopeOpen && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-72 h-48 bg-gradient-to-b from-white to-note-yellow/30 rounded shadow-xl animate-letter-emerge border border-primary/20" />
                  )}

                  {/* Decorative hearts */}
                  <div className="absolute -top-2 -right-2 text-retro-pink text-sm animate-bounce-slow opacity-70">💕</div>
                  <div className="absolute -bottom-2 -left-2 text-primary text-xs animate-bounce-slow opacity-70" style={{ animationDelay: '0.5s' }}>💖</div>
                </div>

                {!isEnvelopeOpen && (
                  <div className="text-center mt-6 animate-fade-in">
                    <p className="text-sm text-gray-700 mb-2 font-medium">{config.letter.envelopeClickHint}</p>
                    <div className="inline-block px-4 py-2 bg-retro-yellow/80 rounded-full text-xs font-bold text-primary border-2 border-primary/30 animate-pulse shadow-sm">
                      {config.letter.specialDeliveryText}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Letter Content Section */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="min-h-[350px] md:min-h-[400px] relative w-full"
            >
              <div className="bg-gradient-to-br from-white to-note-yellow/20 rounded-xl p-6 md:p-8 lg:p-10 shadow-inner border-2 border-primary/20 min-h-[350px] md:min-h-[400px] relative max-w-5xl mx-auto flex flex-col justify-between">
                {/* Paper texture background */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-retro-yellow to-transparent rounded-xl" />
                
                {/* Letter image - positioned relative to this letter container */}
                <motion.div 
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 0.8, rotate: 15 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute -top-4 md:-top-6 -right-4 md:-right-6 pointer-events-none z-30"
                >
                  <img
                    src={letterImg}
                    alt="Love"
                    className="w-16 md:w-24 h-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </motion.div>
                
                {/* Letter header */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b-2 border-primary/20 relative">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-retro-pink flex items-center justify-center text-white text-sm md:text-lg shadow-sm animate-pulse">💝</div>
                      <span className="text-sm md:text-base lg:text-lg font-bold text-primary">{config.letter.letterHeaderTitle}</span>
                    </div>
                  </div>

                  {/* Letter content - clean and compact */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="handwriting text-base md:text-lg leading-relaxed md:leading-loose text-gray-800"
                  >
                    {/* Greeting - left aligned */}
                    <div className="mb-4 md:mb-5 text-primary font-bold text-lg md:text-xl">
                      {greeting}
                    </div>
                    
                    {/* Main body - clean formatting */}
                    <div className="mb-6 md:mb-8 text-justify" style={{ textIndent: '1.5rem', lineHeight: '1.8' }}>
                      {bodyContent}
                    </div>
                    
                    {/* Signature with typing animation */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="mt-6 md:mt-8 ml-auto w-fit"
                    >
                      <div className="font-bold text-primary text-lg md:text-xl">
                        {typedSignature}
                        {typedSignature.length < signature.length && (
                          <span className="inline-block w-0.5 md:w-1 h-5 md:h-6 bg-primary ml-1 animate-cursor" />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 text-retro-yellow opacity-40 text-xs animate-float-slow">✨</div>
                <div className="absolute bottom-16 md:bottom-24 right-3 md:right-4 text-retro-pink opacity-40 text-xs animate-float-slow" style={{ animationDelay: '1s' }}>💕</div>
              </div>

              {/* Continue Button */}
              {showContinue && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center mt-6 md:mt-8"
                >
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => onNext?.(), 300);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                  >
                    {config.letter.continueButton}
                    <span className="material-icons-round">arrow_forward</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.main>

        {/* Custom Styles */}
        <style>{`
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
          .animate-sparkle-pop { animation: sparkle-pop 1s ease forwards; }
          .animate-letter-emerge { animation: letter-emerge 0.8s ease forwards; }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes sparkle-pop { 
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0); } 
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } 
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) translateY(-20px); } 
          }
          @keyframes letter-emerge { 
            from { transform: translateX(-50%) translateY(100%); opacity: 0; } 
            to { transform: translateX(-50%) translateY(0); opacity: 1; } 
          }
          .handwriting { font-family: 'Caveat', cursive; }
        `}</style>
      </>
    );
}