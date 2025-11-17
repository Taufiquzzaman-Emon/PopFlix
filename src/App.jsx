import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Components from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearch, fetchMovies } from "./server";

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(() => setDebouncedSearch(search), 500, [search]);
  const fetchMOVIES = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to get movies");
      }

      const data = await response.json();

      if (data.response === "False") {
        setError(data.error || "Unknown error occurred");
        setMovies([]);
        return;
      }

      setMovies(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearch(query, data.results[0]);
      }
    } catch (error) {
      setError("Error fecthing movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetchMovies();
      setTrendingMovies(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMOVIES(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const scrollLeft = () => {
    document.getElementById("trending-scroll")?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("trending-scroll")?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./src/assets/hero-img.png" />
          <h1>
            Find <span className="text-gradient">movies</span> without hassle
          </h1>
          <Search searchTerm={search} setSearchTerm={setSearch} />
        </header>

        <section className="trending">
          <h2>Trending</h2>

          <div className="scroll-wrapper">
            <button className="scroll-btn left" onClick={() => scrollLeft()}>
              ◀
            </button>

            <ul id="trending-scroll">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>

            <button className="scroll-btn right" onClick={() => scrollRight()}>
              ▶
            </button>
          </div>
        </section>

        <section className="all-movies">
          <h2>All Movies</h2>
          {loading ? (
            <Components />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
