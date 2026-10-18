# The Ultimate Rick and Morty Explorer

A cross-platform Expo application that turns the public Rick and Morty API into a connected, interactive multiverse field guide. Browse every record, compare characters, uncover relationships, inspect live statistics, and test your knowledge.

The project began as a 2023 mobile-programming final assignment. It now uses a modern Expo stack and a redesigned experience for Android, iOS, and web.

## Features

- Animated portal dashboard with API totals and a random-character scanner.
- Universal search across characters, locations, and episodes, with local recent searches.
- Character search with status, gender, species, and type filters.
- Complete character profiles with clickable origin, last location, and episode appearances.
- Location explorer with name, type, and dimension filters.
- Location details with complete resident manifests.
- Episode search and season filtering.
- Episode details with air dates and complete cast manifests.
- Character Comparison Lab with shared traits, connection score, and shared episodes.
- Galactic Statistics dashboard generated from every API record and cached locally.
- Relationship Explorer with co-star rankings and an interactive network graph.
- Ten-question Brainalyzer quiz with streaks and a locally stored high score.
- Navigation between related characters, locations, and episodes.
- Persistent favorites stored locally on the device.
- Native sharing from character, location, and episode records.
- Haptic interaction feedback on supported devices.
- Pagination, pull-to-refresh, loading, empty, and error states.
- Raw API record links for every resource.
- Fully redesigned responsive Android, iOS, and web interface using Space Grotesk and Orbitron.

## Tech stack

- Expo SDK 57
- React 19 and React Native 0.86
- React Navigation 7
- AsyncStorage
- Expo Haptics, Linear Gradient, and Google Fonts
- React Native SVG
- Jest and `jest-expo`
- Rick and Morty REST API

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm
- Expo Go or an Android/iOS simulator for native testing

### Setup

```bash
git clone https://github.com/rockwellsinaga/rick-and-morty-explorer.git
cd rick-and-morty-explorer
npm install
npm start
```

From the Expo development server, press `w` for web, `a` for Android, or scan the QR code with Expo Go.

No API key, environment file, or database is required.

## Quality checks

```bash
npm run doctor
npm test
npm run export:web
```

GitHub Actions runs the same checks for pushes and pull requests.

## Deployment

Every push to `main` builds and deploys the web app to GitHub Pages through the `Deploy GitHub Pages` workflow:

`https://rockwellsinaga.github.io/rick-and-morty-explorer/`

The Expo `baseUrl` is configured for the repository subpath, and the deployment artifact includes `.nojekyll` so GitHub Pages serves Expo's `_expo` assets correctly.

## Project structure

```text
.
|-- App.js
|-- src/
|   |-- api/
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- pages/
|   |-- utils/
|   `-- theme.js
|-- assets/
|-- app.json
`-- package.json
```

## Data and attribution

Character, location, and episode data come from the community-built [Rick and Morty API](https://rickandmortyapi.com/documentation). Rick and Morty and all related properties belong to their respective rights holders. This is an unofficial learning and portfolio project and is not affiliated with Adult Swim.
