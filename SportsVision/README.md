# SportVision (React Native / Expo)

Lightweight mobile app built with Expo + React Native. Uses TheSportsDB free API to fetch teams, players and upcoming matches. This README explains setup, how to provide your TheSportsDB API key, and where to find main features implemented so far.

## Quick Start (development)

1. Install dependencies

```powershell
cd SportsVision
npm install
```

2. Add your TheSportsDB API key (recommended)

- Create a `.env` file at the project root (we created a `.env` placeholder). Add the key:

```
THESPORTSDB_KEY=your_real_key_here
```

- We wired `app.config.js` to load `.env` into `expo.extra` so the app reads the key via `expo-constants`.

Alternative: set the key in `app.json` under `expo.extra.THESPORTSDB_KEY` or set the environment variable before starting:

```powershell
$env:THESPORTSDB_KEY = 'your_real_key_here'; npm start
```

If no key is provided the app falls back to TheSportsDB public test key `1` (rate-limited) — useful for quick local checks but not for sustained testing.

3. Start the dev server

```powershell
npm start
```

Open in Expo Go or a simulator.

## Files & Where Things Live

- API wrapper: `src/api/sportsApi.js` — functions: `fetchTeamsByLeague`, `fetchTeamDetails`, `fetchPlayersByTeam`, `fetchUpcomingEventsByTeam`, `fetchTeamsFromLeagues`
- League configuration (default): `src/config/leagues.js`
- Home screen: `src/screens/HomeScreenFixed.js` — league picker, Popular Teams, Top Players, Upcoming Matches
- Teams list: `src/screens/TeamsListScreen.js`
- Notifications: `src/screens/NotificationsScreen.js` and Redux slice `src/store/notificationsSlice.js` (persisted to AsyncStorage)
- Header components: `src/components/HeaderBar.js`, `src/components/BackHeader.js`
- Image fallback helper: `src/components/ImageWithFallback.js`

## Features implemented

- Multi-league fetch (merge/dedupe) for Home teams.
- League selection modal on Home (user can pick which leagues to aggregate).
- Prefetch players and matches for top teams (expanded pool).
- Notifications screen with grouped sections, persistence and a small mark-as-read action.
- Unread count shown as a badge on the bottom `Notifications` tab.
- Profile edit screen (Name/Email/Username) with persistence.
- `.env` + `app.config.js` wiring for safer local API-key usage.

## Environment & Secrets

- `.env` is ignored by `.gitignore`. Do not commit API keys.
- For production builds, consider using EAS secrets or your CI secret manager to inject `THESPORTSDB_KEY` at build time.

## Recommended next steps

- Replace the default public key with your TheSportsDB API key in `.env` for reliable access.
- Improve per-section skeletons and ensure `ImageWithFallback` is used across all list cards.
- Optionally add a settings screen to manage selected leagues and other preferences.

## Troubleshooting

- If API responses are empty or rate-limited, verify your key and that it is set correctly:
  - `app.config.js` loads `process.env.THESPORTSDB_KEY` into `expo.extra` for dev.
  - Confirm with `npm start` (restart required after changing `.env`).

## Credits

- Built with Expo + React Native.
- Data from TheSportsDB (https://www.thesportsdb.com)

---

If you want, I can add a short development checklist or run a small verification log to show the resolved API key at runtime (masked). What would you like next?
