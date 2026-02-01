import React, { useState } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue);
    }
  };

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search icon" />
        <input
          type="text"
          name="search-term"
          id="search-term"
          placeholder="Search for movies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} 
        />
      </div>
    </div>
  );
};

export default Search;
