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
