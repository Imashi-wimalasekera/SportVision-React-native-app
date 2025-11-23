// app.config.js — loads .env into Expo `extra` so `Constants.manifest.extra` contains secrets for dev
// This uses `dotenv` to load local env vars. Install with `npm install dotenv --save-dev` if you don't have it.
require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      THESPORTSDB_KEY: process.env.THESPORTSDB_KEY || '',
    },
  };
};
