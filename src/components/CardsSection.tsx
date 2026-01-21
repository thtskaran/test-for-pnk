import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConfig, getImageSrc } from '../utils/configHandler';

interface CardsSectionProps {
  onNext: () => void;
}

const CardsSection: React.FC<CardsSectionProps> = ({ onNext }) => {
  const { config, loading } = useConfig();
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const flipCard = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const pic1 = getImageSrc(config.cards.images.card1Image);
  const pic2 = getImageSrc(config.cards.images.card2Image);
  const pic3 = getImageSrc(config.cards.images.card3Image);

  return (
    <>
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center"
      >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12 md:mb-16 relative z-10"
          >
            <span className="block text-retro-pink font-hand text-2xl md:text-3xl rotate-[-4deg] mb-2">{config.cards.subheading}</span>
            <h1 className="text-4xl md:text-7xl font-display text-primary drop-shadow-sm tracking-tight leading-tight">
              {config.cards.heading}
            </h1>
            <p className="mt-4 text-gray-600 max-w-md mx-auto font-medium text-sm md:text-base">
              {config.cards.instruction}
            </p>
          </motion.div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 relative z-0">
            <div className="group perspective-1000 w-full h-64 cursor-pointer transform hover:z-20 hover:scale-105 transition-all duration-300 rotate-[-3deg] translate-y-4" onClick={() => flipCard(0)}>
              <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d shadow-retro hover:shadow-xl rounded-sm ${flippedCards.includes(0) ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full bg-note-pink text-gray-800 p-6 flex items-center justify-center backface-hidden rounded-sm border-t-[12px] border-black/5">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm"></div>
                  <h3 className="font-hand text-4xl leading-relaxed text-gray-800">{config.cards.card1Front}</h3>
                </div>
                <div className="absolute w-full h-full bg-white text-gray-800 p-4 flex flex-col items-center justify-center backface-hidden rotate-y-180 rounded-sm border-2 border-note-pink border-dashed">
                  <img src={pic1} alt="Memory" className="w-32 h-32 object-cover rounded-lg shadow-md mb-3" />
                  <p className="font-bold text-base mb-1">{config.cards.card1BackTitle}</p>
                  <p className="text-center text-sm">{config.cards.card1BackText}</p>
                  <span className="mt-2 text-xl">{config.cards.card1BackEmoji}</span>
                </div>
              </div>
            </div>

            <div className="group perspective-1000 w-full h-64 cursor-pointer transform hover:z-20 hover:scale-105 transition-all duration-300 rotate-[4deg] -translate-y-2 lg:translate-y-12" onClick={() => flipCard(1)}>
              <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d shadow-retro hover:shadow-xl rounded-sm ${flippedCards.includes(1) ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full bg-note-yellow text-gray-800 p-6 flex items-center justify-center backface-hidden rounded-sm border-t-[12px] border-black/5">
                  <div className="absolute -top-6 left-1/3 transform -translate-x-1/2 w-24 h-8 bg-white/40 rotate-[-2deg] backdrop-blur-sm shadow-sm"></div>
                  <h3 className="font-hand text-4xl leading-relaxed text-gray-800">{config.cards.card2Front}</h3>
                </div>
                <div className="absolute w-full h-full bg-white text-gray-800 p-4 flex flex-col items-center justify-center backface-hidden rotate-y-180 rounded-sm border-2 border-note-yellow border-dashed">
                  <img src={pic2} alt="Memory" className="w-32 h-32 object-cover rounded-lg shadow-md mb-3" />
                  <p className="font-bold text-base mb-1">{config.cards.card2BackTitle}</p>
                  <p className="text-center text-sm">{config.cards.card2BackText}</p>
                  <span className="mt-2 text-red-500 material-icons-round">favorite</span>
                </div>
              </div>
            </div>

            <div className="group perspective-1000 w-full h-64 cursor-pointer transform hover:z-20 hover:scale-105 transition-all duration-300 rotate-[-6deg] translate-y-8 lg:-translate-y-4" onClick={() => flipCard(2)}>
              <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d shadow-retro hover:shadow-xl rounded-sm ${flippedCards.includes(2) ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full bg-note-blue text-gray-800 p-6 flex items-center justify-center backface-hidden rounded-sm border-t-[12px] border-black/5">
                  <div className="absolute -top-5 right-12 w-28 h-8 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm"></div>
                  <h3 className="font-hand text-3xl leading-relaxed text-gray-800">{config.cards.card3Front}</h3>
                </div>
                <div className="absolute w-full h-full bg-white text-gray-800 p-4 flex flex-col items-center justify-center backface-hidden rotate-y-180 rounded-sm border-2 border-note-blue border-dashed">
                  <img src={pic3} alt="Memory" className="w-32 h-32 object-cover rounded-lg shadow-md mb-3" />
                  <p className="font-bold text-base mb-1">{config.cards.card3BackTitle}</p>
                  <p className="text-center text-xs">{config.cards.card3BackText}</p>
                  <div className="mt-2 border-2 border-primary text-primary px-2 py-1 rounded text-xs font-bold rotate-[-10deg]">{config.cards.card3BackStamp}</div>
                </div>
              </div>
            </div>

          </div>
        </motion.main>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full py-8 flex justify-center items-center relative z-20"
        >
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => onNext?.(), 300);
            }}
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
          >
            {config.cards.continueButton}
            <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </motion.div>

        {/* Custom Styles */}
        <style>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotatey(180deg);
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
        `}</style>
      </>
  );
};

export default CardsSection;