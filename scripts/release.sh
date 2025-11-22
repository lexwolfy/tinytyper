#!/bin/bash

# TinyTyper Release Script
# This script helps create a new release by:
# 1. Updating the version in package.json
# 2. Creating a git tag
# 3. Pushing to GitHub to trigger the release workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TinyTyper Release Script ===${NC}\n"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
  read -p "Do you want to continue? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "Current version: ${GREEN}${CURRENT_VERSION}${NC}\n"

# Ask for new version
echo "What type of release is this?"
echo "1) Patch (bug fixes)"
echo "2) Minor (new features)"
echo "3) Major (breaking changes)"
echo "4) Custom version"
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    NEW_VERSION=$(npm version patch --no-git-tag-version)
    ;;
  2)
    NEW_VERSION=$(npm version minor --no-git-tag-version)
    ;;
  3)
    NEW_VERSION=$(npm version major --no-git-tag-version)
    ;;
  4)
    read -p "Enter custom version (e.g., 1.2.3): " custom_version
    NEW_VERSION=$(npm version $custom_version --no-git-tag-version)
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac

# Remove the 'v' prefix that npm version adds
NEW_VERSION=${NEW_VERSION#v}

echo -e "\nNew version will be: ${GREEN}${NEW_VERSION}${NC}"

# Ask for release notes
echo -e "\nEnter release notes (press Ctrl+D when done):"
RELEASE_NOTES=$(cat)

# Confirm release
echo -e "\n${YELLOW}Ready to create release:${NC}"
echo -e "Version: ${GREEN}v${NEW_VERSION}${NC}"
echo -e "\nRelease notes:"
echo "$RELEASE_NOTES"
echo
read -p "Continue with release? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Release cancelled${NC}"
  exit 1
fi

# Create git commit and tag
git add package.json package-lock.json
git commit -m "Release v${NEW_VERSION}

${RELEASE_NOTES}"

git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}

${RELEASE_NOTES}"

echo -e "\n${GREEN}Created git tag v${NEW_VERSION}${NC}"

# Push to GitHub
echo -e "\nPushing to GitHub..."
git push origin main
git push origin "v${NEW_VERSION}"

echo -e "\n${GREEN}✓ Release v${NEW_VERSION} has been created!${NC}"
echo -e "GitHub Actions will now build and publish the release."
echo -e "Check the progress at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
