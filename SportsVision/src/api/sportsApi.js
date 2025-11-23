import axios from 'axios';

const BASE = 'https://www.thesportsdb.com/api/v1/json/1';

export async function fetchTeamsByLeague(league = 'English Premier League') {
  const url = `${BASE}/search_all_teams.php?l=${encodeURIComponent(league)}`;
  const res = await axios.get(url);
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
  return res.data && res.data.player ? res.data.player : [];
}

export async function fetchUpcomingEventsByTeam(teamId) {
  const url = `${BASE}/eventsnext.php?id=${teamId}`;
  const res = await axios.get(url);
  return res.data && res.data.events ? res.data.events : [];
}
