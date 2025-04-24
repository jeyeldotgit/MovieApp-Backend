require("dotenv").config();

const API_KEY = process.env.TMDB_API_KEY;

const TMDB_HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

module.exports = {
  API_KEY,
  TMDB_HEADERS,
  TMDB_BASE_URL: "https://api.themoviedb.org/3",
};
