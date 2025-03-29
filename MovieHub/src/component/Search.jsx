import React, { useState } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue); // Update the search term only on Enter
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
          onChange={(e) => setInputValue(e.target.value)} // Update local state
          onKeyDown={handleKeyDown} // Trigger update on Enter key press
        />
      </div>
    </div>
  );
};

export default Search;
