import React from "react";
import MovieCard from "./component/MovieCard";
import Search from "./component/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <div className="App">
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Movie Logo" />
          <h1 className="hero-title">Find your favorite movies here</h1>
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>
        <main>
          <h1 className="text-white">{searchTerm}</h1>
        </main>
      </div>
    </div>
  );
};

export default App;
