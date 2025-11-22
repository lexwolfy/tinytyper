# Release & Deployment Guide

This document explains how to create releases and deploy TinyTyper.

## Overview

TinyTyper has two deployment targets:
1. **GitHub Pages** - Web app (automatically deployed on every push to main)
2. **GitHub Releases** - Desktop apps for Mac, Windows, and Linux (created via tags)

## Creating a New Release

### Using the Release Script (Recommended)

The easiest way to create a release is using the built-in release script:

```bash
npm run release
```

This interactive script will:
1. Show your current version
2. Ask what type of release (patch/minor/major)
3. Update package.json version
4. Prompt for release notes
5. Create a git commit and tag
6. Push to GitHub, triggering the build workflow

### Manual Release

If you prefer to create a release manually:

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Create and push the tag
git push origin main
git push origin v<version>
```

## Automated Workflows

### Release Workflow (.github/workflows/release.yml)

**Trigger:** When a tag starting with `v` is pushed (e.g., `v1.0.0`)

**What it does:**
1. Builds the Next.js app
2. Builds the Electron wrapper
3. Creates platform-specific distributables:
   - **macOS:** .dmg and .zip files
   - **Windows:** .exe installer
   - **Linux:** .AppImage and .deb packages
4. Creates a GitHub Release with all files attached

**Platforms:**
- Builds run on macOS, Windows, and Linux runners
- Each platform builds its own distributables
- All files are uploaded to the GitHub Release

### Deploy Workflow (.github/workflows/deploy.yml)

**Trigger:** Every push to the `main` branch

**What it does:**
1. Builds the Next.js static export
2. Deploys to GitHub Pages
3. Web app becomes available at: `https://<username>.github.io/tinytyper`

## Download Banner

The web app includes a download banner at the top of the page that links to:
- Mac: `TinyTyper.dmg`
- Windows: `TinyTyper.exe`
- Linux: `TinyTyper.AppImage`

These links point to the latest GitHub Release.

## First-Time Setup

### Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (under "Code and automation")
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Save

### Repository Permissions

The workflows use `GITHUB_TOKEN` which is automatically provided. No additional secrets needed!

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **Patch** (0.0.X): Bug fixes, small updates
- **Minor** (0.X.0): New features, backward compatible
- **Major** (X.0.0): Breaking changes

## Testing Builds Locally

Before creating a release, you can test builds locally:

```bash
# Test Next.js build
npm run build:app

# Test Electron build
npm run build:electron

# Test full distribution for your platform
npm run dist:mac    # macOS
npm run dist:win    # Windows
npm run dist:linux  # Linux
```

Built files will be in the `release/` directory.

## Troubleshooting

### Build Fails on GitHub Actions

- Check the Actions tab for detailed logs
- Common issues:
  - Missing dependencies in package.json
  - TypeScript errors
  - Build configuration issues

### Download Links Don't Work

- Make sure the release was created successfully
- Check that the file names match in the download banner
- Verify the GitHub username in the URLs

### GitHub Pages Not Updating

- Ensure GitHub Pages is enabled in settings
- Check the Deploy workflow run for errors
- Pages deployment can take a few minutes

## File Structure

```
.github/
  workflows/
    deploy.yml          # GitHub Pages deployment
    release.yml         # Release builds
scripts/
  release.sh            # Interactive release script
release/                # Local build output (gitignored)
out/                    # Next.js static export (gitignored)
dist/                   # Compiled Electron code (gitignored)
```

## Environment Variables

- `NEXT_PUBLIC_BASE_PATH`: Set to `/tinytyper` for GitHub Pages
  - Used only in the deploy workflow
  - Not needed for local development or Electron builds

## Support

For issues with:
- **Releases:** Check `.github/workflows/release.yml`
- **Deployment:** Check `.github/workflows/deploy.yml`
- **Build errors:** Check `next.config.ts` and `package.json`
