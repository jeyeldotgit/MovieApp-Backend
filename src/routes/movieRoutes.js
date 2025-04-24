const express = require("express");
const router = express.Router();
const { getMovies, searchMovies } = require("../controller/movieController");

router.get("/getmovies", getMovies);
router.get("/search", searchMovies);

module.exports = router;
