import React, { useEffect, useRef, useState } from "react";
import { useConfig, getMusicSrc } from "../utils/configHandler";

type Track = {
  id: number;
  title: string;
  caption: string;
  src: string;
  startTime?: number;
  endTime?: number;
};

interface ChillZoneProps {
  onNext?: () => void;
}

// Global audio container to persist across unmounts
let globalAudioContainer: HTMLDivElement | null = null;
const getGlobalAudioContainer = () => {
  if (!globalAudioContainer) {
    globalAudioContainer = document.createElement('div');
    globalAudioContainer.id = 'persistent-audio-container';
    globalAudioContainer.style.display = 'none';
    document.body.appendChild(globalAudioContainer);
  }
  return globalAudioContainer;
};

export default function ChillZone({ onNext }: ChillZoneProps) {
  const { config, loading } = useConfig();
  
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const tracks: Track[] = config ? config.chillZone.tracks.map(track => ({
    id: track.id,
    title: track.title,
    caption: track.caption,
    src: getMusicSrc(track.musicPath),
    startTime: track.startTime ?? 0,
    endTime: track.endTime
  })) : [];

  // Initialize audio elements in persistent container
  useEffect(() => {
    if (!config || tracks.length === 0) return;
    const container = getGlobalAudioContainer();
    
    // Create or reuse audio elements
    audioRefs.current = tracks.map((track) => {
      let audio = container.querySelector(`audio[data-track-id="${track.id}"]`) as HTMLAudioElement;
      if (!audio) {
        audio = document.createElement('audio');
        audio.src = track.src;
        audio.preload = 'metadata';
        audio.setAttribute('data-track-id', track.id.toString());
        container.appendChild(audio);
      }
      return audio;
    });

    // Check if any audio is playing and sync state
    audioRefs.current.forEach((audio, index) => {
      if (audio && !audio.paused) {
        setActiveIndex(index);
        setIsPlaying(true);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
        setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      }
    });
  }, [config, tracks]);

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // play/pause logic: only one plays at a time
  const togglePlay = async (index: number) => {
    const currentAudio = audioRefs.current[index];
    const track = tracks[index];
    if (!currentAudio || !track) return;

    // if clicking the currently active track
    if (activeIndex === index) {
      if (currentAudio.paused) {
        await currentAudio.play();
        setIsPlaying(true);
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
      return;
    }

    // pause other audios
    audioRefs.current.forEach((a, i) => {
      if (a && i !== index) {
        a.pause();
        a.currentTime = 0;
      }
    });

    // set up events for this audio and set start time
    setActiveIndex(index);
    setIsPlaying(true);
    currentAudio.currentTime = track.startTime ?? 0;

    try {
      await currentAudio.play();
    } catch (err) {
      console.warn("Playback blocked or failed:", err);
      setIsPlaying(false);
    }
  };

  // attach timeupdate / ended listeners when activeIndex changes
  useEffect(() => {
    const idx = activeIndex;
    if (idx == null) {
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    const audio = audioRefs.current[idx];
    const track = tracks[idx];
    if (!audio || !track) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const startTime = track.startTime ?? 0;
      const endTime = track.endTime ?? audio.duration;
      
      // Check if we've reached the end time (only if endTime is specified)
      if (track.endTime && currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        setIsPlaying(false);
        setActiveIndex(null);
        setProgress(0);
        setCurrentTime(startTime);
        setDuration(endTime - startTime);
        return;
      }
      
      const playDuration = endTime - startTime;
      const relativeTime = currentTime - startTime;
      setDuration(playDuration);
      setCurrentTime(relativeTime);
      setProgress(playDuration ? relativeTime / playDuration : 0);
    };
    const onEnded = () => {
      const startTime = track.startTime ?? 0;
      const endTime = track.endTime ?? audio.duration;
      audio.currentTime = startTime;
      setIsPlaying(false);
      setActiveIndex(null);
      setProgress(0);
      setCurrentTime(0);
      setDuration(endTime - startTime);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeIndex, tracks]);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const secs = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${secs}`;
  };

  // seek within active track
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (activeIndex == null) return;
    const audio = audioRefs.current[activeIndex];
    const track = tracks[activeIndex];
    if (!audio || !track) return;
    
    const startTime = track.startTime ?? 0;
    const endTime = track.endTime ?? audio.duration;
    const playDuration = endTime - startTime;
    const relativeTime = (val / 100) * playDuration;
    const absoluteTime = startTime + relativeTime;
    
    audio.currentTime = absoluteTime;
    setCurrentTime(relativeTime);
    setProgress(val / 100);
  };



  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
  }, []);

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <main className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
          {/* Decorative elements */}
          <div className="absolute top-20 left-12 w-8 h-8 bg-retro-yellow rounded-full opacity-60 animate-float flex items-center justify-center">
            <span className="material-icons-round text-sm text-gray-600">music_note</span>
          </div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-retro-pink rounded-full opacity-50 animate-float-slow flex items-center justify-center">
            <span className="material-icons-round text-lg text-gray-600">headphones</span>
          </div>
          <div className="absolute bottom-32 left-8 w-6 h-6 bg-retro-green rounded-full opacity-70 animate-float flex items-center justify-center">
            <span className="material-icons-round text-xs text-gray-600">queue_music</span>
          </div>

          <div className="text-center mb-12 relative z-10">
            <span className="block text-retro-pink font-hand text-2xl rotate-[-2deg] mb-2">{config.chillZone.subheading}</span>
            <h1 className="text-4xl md:text-6xl font-display text-primary drop-shadow-sm tracking-tight leading-tight">
              {config.chillZone.heading}
            </h1>
          </div>

          {/* Track Selection Section */}
          <div className="w-full max-w-5xl mb-8 px-4">
            {/* Vertical Stacked Cards */}
            <div className="relative max-w-3xl mx-auto">
              <div className="flex flex-col gap-8 items-center">
                {tracks.map((track, index) => {
                  const active = activeIndex === index;
                  const rotations = ['-2deg', '1deg', '-1deg'];
                  const translateY = ['0', '1rem', '-0.5rem'];
                  
                  return (
                    <div
                      key={track.id}
                      className={`group relative cursor-pointer transition-all duration-300 w-full max-w-2xl ${active
                          ? "scale-105 z-10"
                          : "hover:scale-105 hover:z-10"
                        }`}
                      style={{
                        transform: active ? 'scale(1.05)' : `rotate(${rotations[index % 3]}) translateY(${translateY[index % 3]})`
                      }}
                      onClick={() => togglePlay(index)}
                    >
                      {/* Cassette Card Container with grain texture */}
                      <div className="relative rounded-xl p-3 sm:p-4 shadow-xl border-b-6 sm:border-b-8 border-r-6 sm:border-r-8 overflow-hidden" style={{
                        backgroundColor: index === 0 ? '#f4e4d6' : index === 1 ? '#e8f4e4' : '#e4e8f4',
                        borderColor: index === 0 ? '#dcbca0' : index === 1 ? '#c0dcb0' : '#b0c0dc'
                      }}>
                        {/* Grain texture overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-30 z-10 rounded-xl" 
                          style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQfLwKpJ6m53dqDbArDOJvMRsH9RUeUog_BPCNLYJfUoLpy1Ae1kp2WXUGf3UcrXPIsYA8hMORH1YxbJ_NuEfu49Sxd6CgO62dshT8Z9ty9b3WlphRmLuBbwSCuoBnSYGxRWWRcXwWsIqi4n_uijPUtSybNQsG6WtFXpBtJ_D2a7uB80FrRdgdq-BcrvaDtIE3dJDym0SPnl-e3vcj1ebWBW0DTY86XgK_daObvhRheAFP7Y_Hq7WULIUHBLpmjKLezio5TbVxw3M')",
                            backgroundSize: 'cover'
                          }}
                        />

                        {/* Cassette Header: Screws and Side A */}
                        <div className="flex justify-between items-center px-2 mb-2 sm:mb-3 relative z-20">
                          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#c5a995] shadow-inner flex items-center justify-center">
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute rotate-45"></div>
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute -rotate-45"></div>
                          </div>
                          <div className="text-[8px] sm:text-[10px] font-bold tracking-widest text-[#a38773] opacity-60 uppercase">Side A</div>
                          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#c5a995] shadow-inner flex items-center justify-center">
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute rotate-45"></div>
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute -rotate-45"></div>
                          </div>
                        </div>

                        {/* Cassette Label Area */}
                        <div className="bg-[#ffe4ea] rounded-lg p-2 sm:p-3 relative overflow-hidden border-2 border-white/40 shadow-sm z-20">
                          {/* Retro stripes decoration on label */}
                          <div className="absolute top-0 left-0 w-full h-2 bg-primary/20"></div>
                          <div className="absolute top-3 left-0 w-full h-1 bg-retro-yellow/40"></div>
                          
                          <div className="flex flex-col items-center justify-center gap-0.5 mt-2 sm:mt-3 mb-1 sm:mb-2 z-10 relative">
                            <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#2c1810] tracking-tight text-center leading-tight">
                              {track.title}
                            </h2>
                            <p className="text-primary font-semibold text-xs sm:text-sm tracking-wide">{track.caption}</p>
                          </div>

                          {/* Reel Window */}
                          <div className="bg-white/80 rounded-full h-12 sm:h-16 w-[70%] mx-auto mt-1 sm:mt-2 flex items-center justify-between px-2 sm:px-3 shadow-inner border border-[#eaddcf]">
                            {/* Left Spool */}
                            <div className={`w-10 h-10 rounded-full bg-white border-4 border-[#e0c9b5] flex items-center justify-center shadow-sm relative overflow-hidden ${active && isPlaying ? 'animate-spin-slow' : ''}`}>
                              <div className="absolute w-full h-full rounded-full border-2 border-dashed border-[#a38773] opacity-50"></div>
                              <div className="w-2 h-2 bg-[#a38773] rounded-full"></div>
                              {/* Spool Teeth */}
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom"></div>
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom" style={{transform: 'translateX(-50%) rotate(120deg)'}}></div>
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom" style={{transform: 'translateX(-50%) rotate(240deg)'}}></div>
                            </div>

                            {/* Tape Window */}
                            <div className="flex-1 h-8 mx-2 bg-[#444] rounded relative overflow-hidden flex items-center justify-center">
                              {/* Magnetic tape visual */}
                              <div className="w-[90%] h-[80%] bg-[#222] rounded-sm relative overflow-hidden">
                                {/* Tape winding animation on left */}
                                <div className={`absolute left-0 top-0 bottom-0 bg-[#331a0f] rounded-r-full transition-all duration-1000 ${active && isPlaying ? 'w-2/3' : 'w-1/3'}`}></div>
                                {/* Tape winding animation on right */}
                                <div className={`absolute right-0 top-0 bottom-0 bg-[#331a0f] rounded-l-full transition-all duration-1000 ${active && isPlaying ? 'w-1/3' : 'w-2/3'}`}></div>
                              </div>
                            </div>

                            {/* Right Spool */}
                            <div className={`w-10 h-10 rounded-full bg-white border-4 border-[#e0c9b5] flex items-center justify-center shadow-sm relative overflow-hidden ${active && isPlaying ? 'animate-spin-slow' : ''}`}>
                              <div className="absolute w-full h-full rounded-full border-2 border-dashed border-[#a38773] opacity-50"></div>
                              <div className="w-2 h-2 bg-[#a38773] rounded-full"></div>
                              {/* Spool Teeth */}
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom"></div>
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom" style={{transform: 'translateX(-50%) rotate(120deg)'}}></div>
                              <div className="absolute w-1 h-3 bg-[#eaddcf] top-0 left-1/2 -translate-x-1/2 origin-bottom" style={{transform: 'translateX(-50%) rotate(240deg)'}}></div>
                            </div>
                          </div>
                        </div>

                        {/* Cassette Bottom Area (Controls) */}
                        <div className="mt-2 sm:mt-4 relative px-2 sm:px-4 flex items-center justify-between z-20">
                          {/* Decorative screws bottom */}
                          <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-2 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#c5a995] shadow-inner flex items-center justify-center">
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute rotate-45"></div>
                          </div>
                          
                          {/* Time Display */}
                          <div className="font-mono text-xs text-[#8c7463] font-bold bg-[#eaddcf] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-inner">
                            {active ? formatTime(currentTime) : '0:00'}
                          </div>
                          
                          {/* Play Button (Main Interaction) */}
                          <button className="relative group/btn flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 bg-primary text-white rounded-full shadow-[0_2px_0_rgb(180,20,70)] sm:shadow-[0_4px_0_rgb(180,20,70)] active:shadow-none active:translate-y-1 transition-all duration-150 transform hover:scale-110">
                            <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-0 group-hover/btn:opacity-60 transition-opacity duration-300"></div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10 ml-1 sm:w-6 sm:h-6">
                              {active && isPlaying ? (
                                <g fill="currentColor">
                                  <rect x="6" y="4" width="4" height="16" rx="2"></rect>
                                  <rect x="14" y="4" width="4" height="16" rx="2"></rect>
                                </g>
                              ) : (
                                <path d="M8 5v14l11-7z" fill="currentColor" />
                              )}
                            </svg>
                          </button>
                          
                          {/* Favorite Button */}
                          <button className="text-[#c5a995] hover:text-primary transition-colors duration-200 p-1 sm:p-2 rounded-full hover:bg-[#ffe4ea]/50">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                          
                          {/* Decorative screws bottom right */}
                          <div className="absolute bottom-0.5 sm:bottom-1 right-1 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#c5a995] shadow-inner flex items-center justify-center">
                            <div className="w-1 sm:w-1.5 h-0.5 bg-[#a38773] absolute -rotate-45"></div>
                          </div>
                        </div>

                        {/* Trapezoid Shape at bottom (Cassette Head Area) */}
                        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-3 sm:h-4 bg-[#e6d0bf] rounded-b-lg shadow-sm flex justify-center items-end pb-1 gap-4 z-0"
                          style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}>
                          {/* Magnetic head visualization */}
                          <div className="w-6 sm:w-8 h-2 bg-[#553c2f] rounded-full\"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center mt-8">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-retro hover:shadow-retro-hover hover:bg-primary-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
            >
              {config.chillZone.continueButton}
              <span className="material-icons-round">arrow_forward</span>
            </button>
          </div>
        </main>

        {/* Custom Styles */}
        <style>{`
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </>
  );
}