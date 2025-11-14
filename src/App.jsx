import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Components from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_URL = "https://api.themoviedb.org/3/discover/movie";
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
  const fetchMOVIES = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = `${API_URL}?sort_by=popularity.desc`;
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
    } catch (error) {
      setError("Error fecthing movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMOVIES();
  }, []);

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

        <section className="all-movies">
          <h2 className="mt-20">All Movies</h2>
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
