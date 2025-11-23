# SportVision (React Native / Expo)

Lightweight mobile app built with Expo + React Native. Uses TheSportsDB free API to fetch teams, players and upcoming matches. 

## 🚀 Quick Start

1. Install dependencies

```powershell
cd SportsVision
npm install
```

2. Provide TheSportsDB API key (recommended)

- Create a `.env` file in the `SportsVision/` folder with:

```env
THESPORTSDB_KEY=your_real_key_here
```

- The project loads this into `expo.extra` via `app.config.js`. `src/api/sportsApi.js` will resolve the key from Expo extras or `process.env`. If no key is present, the public test key `1` is used (limited results).

3. Start the app

```powershell
npx expo start -c
```

Open in Expo Go or a simulator.

## 📁 Project Structure (important files)

- `src/api/sportsApi.js` — TheSportsDB wrapper (teams, players, upcoming events)
- `src/config/leagues.js` — default league list
- `src/screens/HomeScreenFixed.js` — Home (league picker, popular teams, top players, upcoming matches)
- `src/screens/TeamsListScreen.js`, `PlayersListScreen.js`, `MatchesListScreen.js` — list screens
- `src/components/ImageWithFallback.js` — image fallback helper
- `src/navigation/MainTabs.js` — bottom tabs (now follows theme)
- `src/theme/ThemeContext.js` — light/dark colors and toggle
- `src/store/` — Redux slices (auth, favourites, notifications)

## ✨ Features Summary

- Multi-league fetching and deduplication for Home
- Persisted league selection (AsyncStorage)
- Prefetch players & upcoming matches for top teams
- Robust logo fallbacks for teams and matches
- Notifications with unread badge on bottom tabs
- Dark mode support (tab bar and screens follow theme)

## 🐞 Debugging tips

- If UI shows sample/mock data, open Metro logs — the app prints diagnostic messages like:
  - `[Players] fetched for team XYZ -> N`
  - `[Home] prefetch team: XYZ id: 123 players: X events: Y`
- Zero counts usually indicate the current TheSportsDB key returned limited/no data. Replace the key in `.env` with your real key and restart Metro.

