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

        // Log all Chinese voices for debugging
        if (lang === 'chinese') {
          const chineseVoices = voices.filter(v => v.lang.startsWith('zh'));
          console.log('🇨🇳 Chinese voices found:', chineseVoices.map(v => `${v.name} (${v.lang})`));
        }

        // Find the best voice for this language
        // Prioritize: 1) local voices matching exact lang, 2) local voices matching lang prefix,
        // 3) any voices matching exact lang, 4) any voices matching lang prefix
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
          console.log('✅ Using voice:', bestVoice.name, '(', bestVoice.lang, ')');
        } else {
          console.log('⚠️ No voice found for', langCode);
          console.log('All available voices:', voices.map(v => `${v.name} (${v.lang})`));
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

      // Create a phrase combining the letter and word
      let phrase = '';

      switch (currentLanguage) {
        case 'english':
          const englishWord = letterData.words[currentLanguage].word;
          phrase = `${key} for ${englishWord}`;
          break;
        case 'french':
          const frenchWord = letterData.words[currentLanguage].word;
          phrase = `${key} comme ${frenchWord}`;
          break;
        case 'chinese':
          // For Chinese, use the actual Chinese characters, not pinyin
          const chineseChars = letterData.words[currentLanguage].chinese;
          phrase = chineseChars;
          break;
      }

      // Speak the phrase
      speak(phrase, currentLanguage);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <p className="text-sm font-semibold">
              Download the desktop app for the best experience!
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.dmg"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Mac
            </a>
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.exe"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
              </svg>
              Windows
            </a>
            <a
              href="https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.AppImage"
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.632-.458 1.303-.53 2.012-.04.39-.04.77-.03 1.146.06 2.073 1.145 4.304 3.065 5.855 3.678 2.97 10.556 3.222 14.221-.316 2.687-2.591 3.38-6.591 1.517-9.494l-.203-.31c-1.21-1.862-2.012-1.84-3.08-3.456-.762-1.151-1.395-3.357-1.741-4.622C17.705 2.226 15.06 0 12.504 0zm-.529 4.705c.25.004.505.03.76.09.543.126 1.035.39 1.475.784.22.197.41.42.584.663.348.486.58 1.056.693 1.672.112.616.104 1.268-.025 1.921-.129.653-.38 1.293-.753 1.881-.373.587-.873 1.111-1.479 1.515-.303.202-.63.375-.977.515-.347.14-.717.247-1.095.318-.189.035-.38.063-.573.082-.193.02-.388.03-.584.027-.392-.006-.784-.06-1.167-.16-.191-.05-.381-.11-.566-.181-.185-.07-.365-.15-.54-.241-.35-.182-.678-.4-.983-.652-.61-.506-1.146-1.148-1.555-1.872-.41-.724-.693-1.53-.82-2.361-.064-.416-.09-.836-.077-1.255.013-.42.061-.838.145-1.249.168-.822.477-1.61.916-2.324.439-.714 1.009-1.35 1.687-1.866.339-.258.704-.482 1.089-.664.192-.091.39-.17.59-.236.2-.066.405-.12.612-.16.207-.04.416-.068.626-.082.105-.007.21-.01.316-.009z"/>
              </svg>
              Linux
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
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            {/* Letter */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 min-w-[240px] flex items-center justify-center">
              <span className="text-[140px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {currentLetter.letter}
              </span>
            </div>

            {/* Emoji */}
            <div className="text-7xl animate-gentle-bounce">
              {currentLetter.words[currentLanguage].emoji}
            </div>

            {/* Word */}
            <div className="bg-white rounded-2xl shadow-xl px-6 py-3">
              {currentLanguage === 'chinese' ? (
                <>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentLetter.words[currentLanguage].chinese}
                  </p>
                  <p className="text-xl text-gray-600 mt-1">
                    {currentLetter.words[currentLanguage].pinyin}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentLetter.words[currentLanguage].word}
                  </p>
                  {currentLetter.words[currentLanguage].chinese && (
                    <p className="text-xl text-gray-600 mt-1">
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
