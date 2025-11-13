import React from "react";

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="search">
      <div>
        <img src="./src/assets/search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search any movies of your likes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Search;
