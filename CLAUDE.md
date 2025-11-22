# TinyTyper

A fun, multilingual keyboard learning app designed for young children to learn the alphabet through interactive play.

## Project Overview

**Purpose**: Teaching the alphabet to kids by turning keyboard play into an educational experience. The app controls input timing to prevent overwhelming the child and provides visual + audio feedback in three languages.

**Target User**: Young children (toddlers/preschoolers) who love playing with keyboards

**Family Context**: Multilingual household (French father, Chinese mother, English common language)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Text-to-Speech**: Web Speech API (browser native)
- **Deployment**: Web app (can be hosted or run locally)

## Current Features

### Core Functionality
- ✅ Keyboard input capture with 5-second throttling between keypresses
- ✅ Prevention of default key behaviors (Cmd+Q, etc.)
- ✅ Letter recognition (A-Z)
- ✅ Trilingual support (English, French, Chinese)
- ✅ Text-to-speech in all 3 languages with proper language codes
- ✅ Visual feedback with large letters, emojis, and words
- ✅ Chinese pinyin + characters alongside translations

### User Interface
- Colorful gradient background (purple → pink → yellow)
- Large, animated letter display (200px)
- Bouncing emoji animations
- Language toggle with flag indicators
- Throttle warning ("Wait a moment...")
- Kid-friendly, high-contrast design

### Vocabulary System
Currently supports letters A-E with example words:
- A: Apple (EN), Avion (FR), Píngguǒ/苹果 (CN)
- B: Bear (EN), Ballon (FR), Xióng/熊 (CN)
- C: Cat (EN), Chat (FR), Māo/猫 (CN)
- D: Dog (EN), Dauphin (FR), Gǒu/狗 (CN)
- E: Elephant (EN), Éléphant (FR), Dàxiàng/大象 (CN)

## Project Structure

```
tinytyper/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main app component (client-side)
│   └── globals.css          # Global styles
├── lib/
│   └── vocabulary.ts        # Letter data and translations
├── public/                  # Static assets
└── package.json
```

## How to Run

```bash
cd tinytyper
npm run dev
```

Open http://localhost:3000

## Configuration

### Throttle Timing
Adjust the delay between keypresses in `app/page.tsx`:
```typescript
const THROTTLE_MS = 5000; // Currently 5 seconds
```

### Speech Settings
Modify voice characteristics in `app/page.tsx`:
```typescript
utterance.rate = 0.8;   // Speech speed (0.1-10)
utterance.pitch = 1.2;  // Voice pitch (0-2)
```

## What's Left to Do

### High Priority
- [ ] Complete vocabulary for all 26 letters (F-Z)
- [ ] Add fullscreen mode for kiosk-like experience
- [ ] Better prevention of system shortcuts (limited by browser security)
- [ ] Test text-to-speech voice quality across languages

### Nice to Have
- [ ] Multiple words per letter (e.g., A: Apple, Airplane, Ant)
- [ ] Category-based learning (animals, fruits, vehicles)
- [ ] Visual images/photos instead of just emojis
- [ ] Sound effects for key presses
- [ ] Progress tracking (which letters learned)
- [ ] Configurable settings panel (parent controls):
  - Throttle timing adjustment
  - Language selection preferences
  - Voice speed/pitch controls
  - Enable/disable languages
- [ ] Animations between letter transitions
- [ ] Celebrate milestones (all vowels, full alphabet)

### Future Enhancements
- [ ] Numbers mode (0-9)
- [ ] Basic words mode (2-3 letter words)
- [ ] Games/quizzes ("Find the letter that makes the 'A' sound")
- [ ] Mobile/tablet touch support
- [ ] Export as standalone desktop app (Electron) for better keyboard control
- [ ] Analytics for parents (most pressed letters, session time)

## Design Decisions

**Why Web App?**
- Cross-platform (works on any device)
- Built-in text-to-speech API
- Fast development/iteration
- Easy for parents to customize

**Why Throttling?**
- Prevents overwhelming the child
- Gives time to absorb each letter/word
- Avoids accidental rapid keypresses

**Why Three Languages?**
- Reflects family's multilingual background
- Children learn vocabulary across languages simultaneously
- Same emoji/concept reinforces cross-language understanding

**Pinyin Approach for Chinese:**
- Maps English/French letters to related Chinese words
- Keeps alphabet learning consistent
- Provides pinyin as pronunciation guide

## Known Limitations

- Cannot fully block system shortcuts (browser security restriction)
- Text-to-speech quality depends on device/OS voices
- Chinese character display requires proper font support
- Fullscreen mode can be exited by user/browser

## Contributing Ideas

When extending the vocabulary:
1. Choose words that are concrete/visual (easy for kids)
2. Prefer words with good emoji representations
3. Ensure Chinese pinyin is correct
4. Test that words sound natural in all three languages

## Notes

- This is a learning toy, not a comprehensive educational app
- Designed for supervised play with parents nearby
- Best experienced on larger screens (laptops/desktops)
- Requires browser with Web Speech API support (Chrome, Safari, Edge)
