import axios from 'axios';
import Constants from 'expo-constants';

// Resolve API key from (1) Expo app config extras, (2) process.env, (3) fallback '1'
const resolveApiKey = () => {
  try {
    const expoExtra = (Constants && (Constants.manifest && Constants.manifest.extra)) || (Constants && Constants.expoConfig && Constants.expoConfig.extra);
    if (expoExtra && expoExtra.THESPORTSDB_KEY) return String(expoExtra.THESPORTSDB_KEY);
  } catch (e) {
    // ignore
  }
  if (typeof process !== 'undefined' && process.env && process.env.THESPORTSDB_KEY) return String(process.env.THESPORTSDB_KEY);
  return '1';
};

const API_KEY = resolveApiKey();
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
// log masked key for debugging (development only)
try { console.debug('[sportsApi] Using API key: ****' + String(API_KEY).slice(-4)); } catch (e) {}

export async function fetchTeamsByLeague(league = 'English Premier League') {
  const url = `${BASE}/search_all_teams.php?l=${encodeURIComponent(league)}`;
  const res = await axios.get(url);
  try { console.debug(`[sportsApi] fetchTeamsByLeague("${league}") ->`, (res.data && res.data.teams) ? res.data.teams.length : 0); } catch (e) {}
  return res.data.teams || [];
}

export async function fetchTeamDetails(id) {
  const url = `${BASE}/lookupteam.php?id=${id}`;
  const res = await axios.get(url);
  return res.data.teams && res.data.teams[0];
}

export async function fetchPlayersByTeam(teamId) {
  const url = `${BASE}/lookup_all_players.php?id=${teamId}`;
  const res = await axios.get(url);
  try { console.debug('[sportsApi] fetchPlayersByTeam(', teamId, ') ->', (res.data && res.data.player) ? res.data.player.length : 0); } catch (e) {}
  return res.data && res.data.player ? res.data.player : [];
}

export async function fetchUpcomingEventsByTeam(teamId) {
  const url = `${BASE}/eventsnext.php?id=${teamId}`;
  const res = await axios.get(url);
  return res.data && res.data.events ? res.data.events : [];
}

export async function fetchTeamByName(name) {
  if (!name) return [];
  const url = `${BASE}/searchteams.php?t=${encodeURIComponent(name)}`;
  const res = await axios.get(url).catch(() => ({ data: null }));
  return res.data && res.data.teams ? res.data.teams : [];
}

export async function fetchTeamsFromLeagues(leagues = []) {
  if (!Array.isArray(leagues) || leagues.length === 0) return [];
  const calls = leagues.map(l => fetchTeamsByLeague(l).catch(() => []));
  const results = await Promise.all(calls);
  // flatten and dedupe by idTeam (or name)
  const all = results.flat();
  const map = new Map();
  all.forEach(t => {
    const id = t && (t.idTeam || t.id);
    const key = id || (t && t.strTeam) || Math.random();
    if (!map.has(key)) map.set(key, t);
  });
  try { console.debug('[sportsApi] fetchTeamsFromLeagues -> fetched', all.length, 'raw,', map.size, 'deduped'); } catch (e) {}
  return Array.from(map.values());
}
