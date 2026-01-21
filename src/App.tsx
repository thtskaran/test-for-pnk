import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import ActivityPage from './components/ActivityPage';
import ChillZone from './components/ChillZone';
import CardsSection from './components/CardsSection';
import FinalLetter from './components/FinalLetter';
import CherryBlossoms from './components/CherryBlossoms';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Show aeroplane intro for 3.8 seconds (plane animation duration), then fade out
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);
  
  const pages = [
    <LandingPage onEnter={() => goToPage(1)} />,
    <ActivityPage onNext={() => goToPage(2)} />,
    <ChillZone onNext={() => goToPage(3)} />,
    <CardsSection onNext={() => goToPage(4)} />,
    <FinalLetter onRestart={() => { setShowIntro(true); setTimeout(() => setShowIntro(false), 3000); setCurrentPage(0); }} />
  ];

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      {/* Aeroplane Intro */}
      {showIntro && (
        <div className={`aeroplane-intro-overlay ${!showIntro ? 'fade-out' : ''}`}>
          {/* Animated SVG Clouds - Cartoon style with soft pastels */}
          <svg className="cloud cloud-1" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#FFF5F0', stopOpacity: 0.95}} />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="55" rx="35" ry="25" fill="url(#cloudGradient1)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="85" cy="50" rx="40" ry="30" fill="url(#cloudGradient1)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="110" cy="55" rx="35" ry="25" fill="url(#cloudGradient1)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="75" cy="65" rx="50" ry="25" fill="url(#cloudGradient1)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
          </svg>
          
          <svg className="cloud cloud-2" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#FFF9F3', stopOpacity: 0.95}} />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="55" rx="35" ry="25" fill="url(#cloudGradient2)" stroke="#EE964B" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="85" cy="50" rx="40" ry="30" fill="url(#cloudGradient2)" stroke="#EE964B" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="110" cy="55" rx="35" ry="25" fill="url(#cloudGradient2)" stroke="#EE964B" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="75" cy="65" rx="50" ry="25" fill="url(#cloudGradient2)" stroke="#EE964B" strokeWidth="1.5" strokeOpacity="0.35"/>
          </svg>
          
          <svg className="cloud cloud-3" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#F0F5F3', stopOpacity: 0.95}} />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="55" rx="35" ry="25" fill="url(#cloudGradient3)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="85" cy="50" rx="40" ry="30" fill="url(#cloudGradient3)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="110" cy="55" rx="35" ry="25" fill="url(#cloudGradient3)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="75" cy="65" rx="50" ry="25" fill="url(#cloudGradient3)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
          </svg>
          
          <svg className="cloud cloud-4" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#FFF5F0', stopOpacity: 0.95}} />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="55" rx="35" ry="25" fill="url(#cloudGradient4)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="85" cy="50" rx="40" ry="30" fill="url(#cloudGradient4)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="110" cy="55" rx="35" ry="25" fill="url(#cloudGradient4)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="75" cy="65" rx="50" ry="25" fill="url(#cloudGradient4)" stroke="#D95D39" strokeWidth="1.5" strokeOpacity="0.35"/>
          </svg>
          
          <svg className="cloud cloud-5" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGradient5" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#F0F5F3', stopOpacity: 0.95}} />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="55" rx="35" ry="25" fill="url(#cloudGradient5)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="85" cy="50" rx="40" ry="30" fill="url(#cloudGradient5)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="110" cy="55" rx="35" ry="25" fill="url(#cloudGradient5)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
            <ellipse cx="75" cy="65" rx="50" ry="25" fill="url(#cloudGradient5)" stroke="#8DA399" strokeWidth="1.5" strokeOpacity="0.35"/>
          </svg>
          
          <img 
            src="/imgs/Aeroplane.png"
            alt="aeroplane" 
            className="aeroplane-img"
          />
          <div className="typing-text">
            <span className="typing-content">Loading something special for you</span>
          </div>
        </div>
      )}



      {!showIntro && (
        <>
          {/* Unified Background */}
          <div className="fixed inset-0 bg-background-light" style={{ zIndex: 0 }} />
          
          {/* Cherry Blossoms */}
          <CherryBlossoms />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="page-container text-gray-800 font-body overflow-hidden relative min-h-screen flex flex-col w-full"
              style={{ maxWidth: '100vw' }}
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <style>{`
        /* Aeroplane Intro Overlay */
        .aeroplane-intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          background: #FDF6E3;
          opacity: 1;
          transition: opacity 1.2s ease-out;
          animation: fadeIn 0.5s ease-in;
          overflow: hidden;
        }

        .aeroplane-intro-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
          transition: opacity 1.2s ease-out;
        }

        .aeroplane-img {
          width: 200px;
          height: auto;
          object-fit: contain;
          animation: flyAcross 3.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          filter: drop-shadow(0 6px 20px rgba(255, 182, 193, 0.5));
          z-index: 10;
          position: relative;
          will-change: transform, opacity;
        }

        /* Animated SVG Clouds - Cartoon style */
        .cloud {
          position: absolute;
          width: 180px;
          height: auto;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(217, 93, 57, 0.15));
          opacity: 0.85;
          will-change: transform;
        }

        .cloud-1 {
          top: 10%;
          left: 15%;
          width: 160px;
          animation: driftCloud1 8s ease-in-out forwards;
        }

        .cloud-2 {
          top: 50%;
          left: 60%;
          width: 200px;
          animation: driftCloud2 8.5s ease-in-out forwards;
        }

        .cloud-3 {
          top: 20%;
          right: 10%;
          width: 140px;
          animation: driftCloud3 7.5s ease-in-out forwards;
        }

        .cloud-4 {
          bottom: 15%;
          left: 35%;
          width: 170px;
          animation: driftCloud4 8.2s ease-in-out forwards;
        }

        .cloud-5 {
          top: 65%;
          right: 25%;
          width: 150px;
          animation: driftCloud5 7.8s ease-in-out forwards;
        }

        .typing-text {
          font-family: 'Fredoka', sans-serif;
          font-size: 22px;
          font-weight: 500;
          color: #D95D39;
          text-align: center;
          position: relative;
          z-index: 10;
          text-shadow: 0 2px 8px rgba(217, 93, 57, 0.2);
        }

        .typing-content {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 3px solid #D95D39;
          padding-right: 8px;
          animation: 
            typing 2.2s steps(34, end) 0s forwards,
            blink 0.8s step-end 0s infinite;
          width: 0;
          will-change: width;
        }

        @keyframes fadeInPage {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes flyAcross {
          0% {
            transform: translateX(-120vw) rotate(-8deg) scale(0.95);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            transform: translateX(0vw) rotate(0deg) scale(1);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) rotate(8deg) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes driftCloud1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotateZ(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translateX(20px) translateY(-12px) rotateZ(-2deg);
            opacity: 0.85;
          }
          50% {
            transform: translateX(35px) translateY(8px) rotateZ(1deg);
            opacity: 0.85;
          }
          75% {
            transform: translateX(15px) translateY(-8px) rotateZ(-1deg);
            opacity: 0.75;
          }
        }

        @keyframes driftCloud2 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotateZ(0deg);
            opacity: 0.65;
          }
          33% {
            transform: translateX(-25px) translateY(10px) scale(1.04) rotateZ(2deg);
            opacity: 0.85;
          }
          66% {
            transform: translateX(-15px) translateY(-10px) scale(0.99) rotateZ(-1deg);
            opacity: 0.8;
          }
        }

        @keyframes driftCloud3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotateZ(0deg);
            opacity: 0.6;
          }
          30% {
            transform: translateX(-30px) translateY(15px) rotateZ(-2deg);
            opacity: 0.85;
          }
          60% {
            transform: translateX(-18px) translateY(-12px) rotateZ(1deg);
            opacity: 0.8;
          }
        }

        @keyframes driftCloud4 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotateZ(0deg);
            opacity: 0.65;
          }
          40% {
            transform: translateX(22px) translateY(-8px) scale(1.05) rotateZ(1.5deg);
            opacity: 0.85;
          }
          70% {
            transform: translateX(12px) translateY(8px) scale(0.98) rotateZ(-1deg);
            opacity: 0.75;
          }
        }

        @keyframes driftCloud5 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotateZ(0deg);
            opacity: 0.6;
          }
          35% {
            transform: translateX(25px) translateY(-12px) rotateZ(-1.5deg);
            opacity: 0.85;
          }
          65% {
            transform: translateX(14px) translateY(12px) rotateZ(1deg);
            opacity: 0.8;
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }

        .page-container.hidden {
          display: none;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .aeroplane-img {
            width: 150px;
          }
          
          .typing-text {
            font-size: 18px;
            padding: 0 20px;
          }

          .typing-content {
            max-width: 85vw;
          }

          .cloud {
            width: 100px;
          }

          .cloud-1 {
            width: 90px;
          }

          .cloud-2 {
            width: 120px;
          }

          .cloud-3 {
            width: 80px;
          }

          .cloud-4 {
            width: 100px;
          }

          .cloud-5 {
            width: 85px;
          }
        }


        .app {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          font-family: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        /* Enhanced dreamy gradient background */
        .dreamy-bg {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 240, 245, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(176, 224, 230, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, 
              #FFF8E7 0%, 
              #FFF4F8 25%, 
              #F0F8FF 50%, 
              #FFF0F5 75%, 
              #FFFACD 100%
            );
          z-index: 0;
        }

        /* Floating particles for dreamy effect */
        .floating-particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255, 182, 193, 0.6), rgba(255, 182, 193, 0.2));
          border-radius: 50%;
          animation: floatParticle linear infinite;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Soft grid overlay for notebook/diary feel */
        .grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background-image: 
            linear-gradient(rgba(255, 182, 193, 0.08) 1px, transparent 1px),
            linear-gradient(to right, rgba(240, 66, 153, 0.06) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.7;
        }

        /* background icons container (behind pages) */
        .bg-icons {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          overflow: hidden;
        }

        /* base icon style */
        .icon {
          position: absolute;
          opacity: 0.85;
          filter: drop-shadow(0 4px 12px rgba(255, 182, 193, 0.15));
          transform-origin: center;
        }

        /* individual icon placements + animations - adjusted positioning */
        .icon-1 { width: 90px; height: 90px; left: 8%; top: 10%; animation: floatSlow 8s ease-in-out infinite; }
        .icon-2 { width: 120px; height: 120px; right: 10%; top: 16%; animation: floatReverse 10s ease-in-out infinite; }
        .icon-3 { width: 70px; height: 70px; left: 22%; bottom: 14%; animation: pulseTiny 6s ease-in-out infinite; transform-origin: center; }
        .icon-4 { width: 48px; height: 48px; right: 20%; bottom: 24%; animation: floatSlow 9s ease-in-out infinite; }

        /* Additional romantic elements */
        .heart-1, .heart-2, .sparkle-text-1, .sparkle-text-2 {
          position: absolute;
          font-size: 24px;
          opacity: 0.6;
          filter: drop-shadow(0 2px 8px rgba(255, 182, 193, 0.2));
        }

        .heart-1 { 
          left: 15%; 
          top: 60%; 
          animation: gentleBob 7s ease-in-out infinite; 
          animation-delay: 1s;
        }
        .heart-2 { 
          right: 12%; 
          top: 70%; 
          animation: gentleBob 8s ease-in-out infinite; 
          animation-delay: 3s;
        }
        .sparkle-text-1 { 
          left: 70%; 
          top: 25%; 
          animation: twinkle 5s ease-in-out infinite; 
          animation-delay: 2s;
        }
        .sparkle-text-2 { 
          right: 25%; 
          bottom: 35%; 
          animation: twinkle 6s ease-in-out infinite; 
          animation-delay: 4s;
        }

        /* Enhanced animations */
        @keyframes floatSlow {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.85; }
          50% { transform: translateY(-12px) rotate(6deg) scale(1.05); opacity: 0.95; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.85; }
        }
        @keyframes floatReverse {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.85; }
          50% { transform: translateY(10px) rotate(-6deg) scale(1.03); opacity: 0.95; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.85; }
        }
        @keyframes pulseTiny {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes gentleBob {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-8px) rotate(5deg); opacity: 0.8; }
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: scale(1.2) rotate(90deg); opacity: 1; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.4; }
          75% { transform: scale(1.1) rotate(270deg); opacity: 0.9; }
        }

        /* Ensure the pages render above background */
        .page-container {
          position: relative;
          z-index: 10;
        }

        /* Responsive adjustments - better positioning */
        @media (max-width: 640px) {
          .icon-1 { left: 6%; top: 6%; width: 64px; height: 64px; }
          .icon-2 { right: 8%; top: 12%; width: 88px; height: 88px; }
          .icon-3 { left: 14%; bottom: 10%; width: 56px; height: 56px; }
          .icon-4 { right: 14%; bottom: 20%; width: 40px; height: 40px; }
          
          .heart-1, .heart-2, .sparkle-text-1, .sparkle-text-2 {
            font-size: 18px;
          }
          
          .grid-overlay {
            background-size: 20px 20px;
          }
          
          .particle {
            width: 3px;
            height: 3px;
          }
        }

        /* Smooth transitions between pages */
        @media (prefers-reduced-motion: reduce) {
          .particle, .icon, .heart-1, .heart-2, .sparkle-text-1, .sparkle-text-2 {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
