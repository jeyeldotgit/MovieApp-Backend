const axios = require("axios");
const { TMDB_BASE_URL, TMDB_HEADERS } = require("../config/tmdb");

exports.getMovies = async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "TMDB API key is missing in server" });
  }

  try {
    const { page = 1, id } = req.query;

    if (id) {
      const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        headers: TMDB_HEADERS,
      });
      return res.json(movieResponse.data);
    }

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        sort_by: "popularity.desc",
        page: page,
      },
      headers: TMDB_HEADERS,
    });

    const embedResponse = await axios.get("https://embed.su/list/movie.json");
    const embedMovies = embedResponse.data;

    const moviesWithEmbedData = response.data.results.map((movie) => {
      const embedMovie = embedMovies.find((embed) => embed.tmdb === movie.id);
      return {
        ...movie,
        embedData: embedMovie || null,
      };
    });

    res.json({ ...response.data, results: moviesWithEmbedData });
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

exports.searchMovies = async (req, res) => {
  const { query } = req.query;

  if (!API_KEY) {
    return res.status(500).json({ error: "TMDB API key is missing in server" });
  }

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  try {
    const totalPagesToFetch = 3;
    let allResults = [];
    const currentYear = new Date().getFullYear();

    for (let page = 1; page <= totalPagesToFetch; page++) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: { query, page },
        headers: TMDB_HEADERS,
      });

      allResults = [...allResults, ...response.data.results];
    }

    const filteredResults = allResults.filter((movie) => {
      const releaseYear = movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null;
      return releaseYear && releaseYear < currentYear;
    });

    const sortedResults = filteredResults.sort(
      (a, b) => b.popularity - a.popularity
    );

    res.json({ results: sortedResults });
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(500).json({ error: "Failed to search movies" });
  }
};
