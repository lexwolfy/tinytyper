'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { vocabulary, type LetterData } from '@/lib/vocabulary';

type Language = 'english' | 'french' | 'chinese';

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState<LetterData | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isThrottled, setIsThrottled] = useState(false);
  const [throttleProgress, setThrottleProgress] = useState(0); // 0-100 for countdown
  const lastKeyTime = useRef<number>(0);
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const THROTTLE_MS = 5000; // 5 seconds between key presses

  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Trigger voice loading
      window.speechSynthesis.getVoices();

      // Listen for voices loaded event
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Text-to-speech function with improved voice selection
  const speak = useCallback((text: string, lang: Language) => {
    console.log('🔊 Attempting to speak:', text, 'in', lang);
    if ('speechSynthesis' in window) {
      // Only cancel if something is currently speaking
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Small delay to ensure cancel completes before speaking
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language code and try to find the best voice
        let langCode = '';
        switch (lang) {
          case 'english':
            langCode = 'en-US';
            break;
          case 'french':
            langCode = 'fr-FR';
            break;
          case 'chinese':
            langCode = 'zh-CN';
            break;
        }

        utterance.lang = langCode;

        // Get available voices and select the best one for the language
        const voices = window.speechSynthesis.getVoices();
        console.log('📢 Available voices:', voices.length);

        // Find the best voice for this language
        // Prioritize: 1) local voices, 2) voices matching the exact language
        const bestVoice = voices.find(voice =>
          voice.lang === langCode && voice.localService
        ) || voices.find(voice =>
          voice.lang.startsWith(langCode.split('-')[0]) && voice.localService
        ) || voices.find(voice =>
          voice.lang === langCode
        ) || voices.find(voice =>
          voice.lang.startsWith(langCode.split('-')[0])
        );

        if (bestVoice) {
          utterance.voice = bestVoice;
          console.log('✅ Using voice:', bestVoice.name);
        } else {
          console.log('⚠️ No voice found for', langCode);
        }

        // Adjust speech parameters for better quality
        utterance.rate = 0.85; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher, but not too much
        utterance.volume = 1.0; // Full volume

        utterance.onstart = () => console.log('🎤 Speech started');
        utterance.onend = () => console.log('✅ Speech ended');
        utterance.onerror = (e) => console.error('❌ Speech error:', e);

        window.speechSynthesis.speak(utterance);
      }, 10); // Small 10ms delay
    } else {
      console.error('❌ speechSynthesis not available');
    }
  }, []);

  // Start throttle countdown timer
  const startThrottleCountdown = useCallback((remainingTime: number) => {
    // Clear any existing timer
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
    }

    setIsThrottled(true);

    const startTime = Date.now();
    const endTime = startTime + remainingTime;

    // Update progress every 50ms for smooth animation
    throttleTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        // Timer finished
        setIsThrottled(false);
        setThrottleProgress(0);
        if (throttleTimerRef.current) {
          clearInterval(throttleTimerRef.current);
          throttleTimerRef.current = null;
        }
      } else {
        // Calculate progress (100 = start, 0 = end)
        const progress = (timeLeft / remainingTime) * 100;
        setThrottleProgress(progress);
      }
    }, 50);
  }, []);

  // Handle key press with throttling
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Get the pressed key (uppercase)
    const key = event.key.toUpperCase();

    // Only handle letter keys A-Z, let everything else pass through
    if (key.length !== 1 || key < 'A' || key > 'Z') {
      return; // Allow system shortcuts like Cmd+R, F5, etc.
    }

    // Now that we know it's a letter, prevent default
    event.preventDefault();

    const now = Date.now();
    const timeSinceLastKey = now - lastKeyTime.current;

    // Check if throttled - if so, ignore the keypress
    if (timeSinceLastKey < THROTTLE_MS) {
      return;
    }

    // Reset throttle and clear any existing timers
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
    lastKeyTime.current = now;

    // Get the letter data
    const letterData = vocabulary[key];

    if (letterData) {
      setCurrentLetter(letterData);

      // Speak the letter first
      speak(key, currentLanguage);

      // Then speak the word after a short delay
      setTimeout(() => {
        const word = letterData.words[currentLanguage].word;
        speak(word, currentLanguage);
      }, 800);

      // Start countdown timer for the next keypress
      startThrottleCountdown(THROTTLE_MS);
    }
  }, [currentLanguage, speak, startThrottleCountdown, THROTTLE_MS]);

  // Set up keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) {
        clearInterval(throttleTimerRef.current);
      }
    };
  }, []);

  // Cycle through languages
  const cycleLanguage = () => {
    setCurrentLanguage(prev => {
      if (prev === 'english') return 'french';
      if (prev === 'french') return 'chinese';
      return 'english';
    });
  };

  const getLanguageFlag = (lang: Language) => {
    switch (lang) {
      case 'english': return '🇬🇧';
      case 'french': return '🇫🇷';
      case 'chinese': return '🇨🇳';
    }
  };

  const getLanguageName = (lang: Language) => {
    switch (lang) {
      case 'english': return 'English';
      case 'french': return 'Français';
      case 'chinese': return '中文';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex flex-col items-center justify-center p-4">
      {/* Download Banner */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <p className="text-sm font-semibold">
              Download the desktop app for the best experience!
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.dmg"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <span>🍎</span> Mac
            </a>
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.exe"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <span>🪟</span> Windows
            </a>
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.AppImage"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <span>🐧</span> Linux
            </a>
          </div>
        </div>
      </div>

      {/* Language Toggle */}
      <button
        onClick={cycleLanguage}
        className="absolute top-20 right-4 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow text-2xl font-bold flex items-center gap-2"
      >
        <span>{getLanguageFlag(currentLanguage)}</span>
        <span className="text-sm">{getLanguageName(currentLanguage)}</span>
      </button>

      {/* Title */}
      <div className="absolute top-20 left-4">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          TinyTyper
        </h1>
      </div>

      {/* Main Letter Display */}
      <div className="flex flex-col items-center gap-8">
        {currentLetter ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            {/* Letter */}
            <div className="bg-white rounded-3xl shadow-2xl p-16 min-w-[300px] flex items-center justify-center">
              <span className="text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {currentLetter.letter}
              </span>
            </div>

            {/* Emoji */}
            <div className="text-9xl animate-gentle-bounce">
              {currentLetter.words[currentLanguage].emoji}
            </div>

            {/* Word */}
            <div className="bg-white rounded-2xl shadow-xl px-8 py-4">
              {currentLanguage === 'chinese' ? (
                <>
                  <p className="text-4xl font-bold text-gray-800">
                    {currentLetter.words[currentLanguage].chinese}
                  </p>
                  <p className="text-2xl text-gray-600 mt-2">
                    {currentLetter.words[currentLanguage].pinyin}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold text-gray-800">
                    {currentLetter.words[currentLanguage].word}
                  </p>
                  {currentLetter.words[currentLanguage].chinese && (
                    <p className="text-2xl text-gray-600 mt-2">
                      {currentLetter.words[currentLanguage].chinese} ({currentLetter.words[currentLanguage].pinyin})
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
              Press any letter!
            </h2>
            <p className="text-xl text-white/80 drop-shadow">
              Type A-Z to learn
            </p>
          </div>
        )}

      </div>

      {/* Throttle Countdown - Right side */}
      {isThrottled && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - throttleProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-100 ease-linear"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
          {/* Optional label */}
          <p className="text-center text-white text-sm mt-2 font-semibold drop-shadow">
            Wait...
          </p>
        </div>
      )}

      {/* Instructions at bottom */}
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-white/70 text-sm">
          Press any letter key (A-Z) • Wait 5 seconds between keys
        </p>
      </div>
    </div>
  );
}
