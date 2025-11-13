import React, { useState } from "react";
import Search from "./components/Search";

const App = () => {
  const [search, setSearch] = useState("");
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./src/assets/hero-img.png" />
          <h1>
            Find <span className="text-gradient">movies</span> without hassle
          </h1>
        </header>
        <Search searchTerm={search} setSearchTerm={setSearch} />
      </div>
    </main>
  );
};

export default App;
