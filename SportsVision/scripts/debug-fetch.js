// Simple Node script to verify TheSportsDB responses using .env key
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.THESPORTSDB_KEY || '123';
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

const LEAGUES = [
  'English Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1'
];

async function fetchTeams(league) {
  const url = `${BASE}/search_all_teams.php?l=${encodeURIComponent(league)}`;
  const res = await axios.get(url).catch(err => ({ data: null, err }));
  return res.data && res.data.teams ? res.data.teams : null;
}

async function fetchPlayers(teamId) {
  const url = `${BASE}/lookup_all_players.php?id=${teamId}`;
  const res = await axios.get(url).catch(err => ({ data: null, err }));
  return res.data && res.data.player ? res.data.player : null;
}

async function fetchEvents(teamId) {
  const url = `${BASE}/eventsnext.php?id=${teamId}`;
  const res = await axios.get(url).catch(err => ({ data: null, err }));
  return res.data && res.data.events ? res.data.events : null;
}

async function main() {
  console.log('Using TheSportsDB key:', API_KEY ? '****' + String(API_KEY).slice(-4) : '(none)');
  for (const league of LEAGUES) {
    try {
      const teams = await fetchTeams(league);
      if (!teams) {
        console.log(`League: ${league} -> no teams returned`);
        continue;
      }
      console.log(`League: ${league} -> ${teams.length} teams`);
      const sample = teams.slice(0, 5).map(t => `${t.idTeam || t.id}::${t.strTeam}`);
      console.log(' Sample teams:', sample.join(' | '));

      // fetch players and events for the first team to validate deeper endpoints
      const first = teams[0];
      if (first && (first.idTeam || first.id)) {
        const id = first.idTeam || first.id;
        const players = await fetchPlayers(id);
        const events = await fetchEvents(id);
        console.log(`  First team id=${id} players=${players ? players.length : 0} events=${events ? events.length : 0}`);
      }
    } catch (e) {
      console.error('Error fetching for league', league, e && e.message);
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
