# TinyTyper

A fun, multilingual keyboard learning app designed for young children to learn the alphabet through interactive play.

![TinyTyper](https://img.shields.io/badge/Next.js-16-black) ![Electron](https://img.shields.io/badge/Electron-39-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Multilingual Support**: Learn letters in English, French, and Chinese
- **Interactive Feedback**: Visual and audio feedback for each letter
- **Kid-Friendly Design**: Colorful, engaging interface with emojis
- **Throttled Input**: Prevents overwhelming children with a 5-second delay between keypresses
- **Text-to-Speech**: Native browser TTS in all three languages
- **Cross-Platform**: Available as a web app and desktop app (Mac, Windows, Linux)

## Quick Start

### Web App

Try it online: [https://aageorges.github.io/tinytyper](https://aageorges.github.io/tinytyper)

### Desktop App

Download the latest release for your platform:

- **macOS**: [TinyTyper.dmg](https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.dmg)
- **Windows**: [TinyTyper.exe](https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.exe)
- **Linux**: [TinyTyper.AppImage](https://github.com/aageorges/tinytyper/releases/latest/download/TinyTyper.AppImage)

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
git clone https://github.com/aageorges/tinytyper.git
cd tinytyper
npm install
```

### Running Locally

**Web app:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Electron app:**
```bash
npm run electron:start
```

This will start the Next.js dev server and launch the Electron window.

### Building

**Build web app:**
```bash
npm run build:app
```

**Build Electron:**
```bash
npm run build:electron
```

**Create distributables:**
```bash
npm run dist:mac      # macOS
npm run dist:win      # Windows
npm run dist:linux    # Linux
```

## Project Structure

```
tinytyper/
├── app/
│   ├── page.tsx          # Main app component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   └── vocabulary.ts     # Letter data and translations
├── electron/
│   ├── main.ts           # Electron main process
│   └── preload.ts        # Electron preload script
├── .github/
│   └── workflows/
│       ├── deploy.yml    # GitHub Pages deployment
│       └── release.yml   # Release builds
└── scripts/
    └── release.sh        # Interactive release script
```

## Releasing

To create a new release:

```bash
npm run release
```

This will guide you through:
1. Choosing a version bump (patch/minor/major)
2. Writing release notes
3. Creating and pushing a git tag
4. Triggering automated builds for all platforms

See [RELEASE.md](./RELEASE.md) for detailed release documentation.

## Configuration

### Throttle Timing

Adjust the delay between keypresses in `app/page.tsx`:
```typescript
const THROTTLE_MS = 5000; // 5 seconds
```

### Speech Settings

Modify voice characteristics in `app/page.tsx`:
```typescript
utterance.rate = 0.85;   // Speech speed (0.1-10)
utterance.pitch = 1.1;   // Voice pitch (0-2)
```

## Contributing

Contributions are welcome! See [CLAUDE.md](./CLAUDE.md) for detailed project documentation.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Desktop**: Electron 39
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Speech**: Web Speech API
- **Build**: electron-builder

## License

MIT

## Acknowledgments

Built with love for multilingual families helping their children learn to type and explore languages.
