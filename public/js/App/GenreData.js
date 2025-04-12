//! Genre data class
export class GenreData {
  constructor() {
    this.moviesGenresMap = {};
    this.seriesGenresMap = {};
    this.allMoviesGenresList = null;
    this.allSeriesGenresList = null;
    this.filterGenresContainer = document.getElementById("filter-genre");
  }

  //! Genres data getter
  async getMoviesData() {
    const { data: response } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`);
    this.allMoviesGenresList = response.genres;
    this.addGenresToFilter(response.genres);
    this.genresPair(response.genres, "movie");
  }

  async getSeriesData() {
    const { data: response } = await axios.get(`https://api.themoviedb.org/3/genre/tv/list`);
    this.allSeriesGenresList = response.genres;
    this.genresPair(response.genres, "tv");
  }

  //! Pairing genres name and iso_name
  genresPair(genresList, mediaType) {
    if (mediaType === "tv") {
      genresList.forEach((genre) => {
        this.seriesGenresMap[genre.id] = genre.name;
      });
    } else {
      genresList.forEach((genre) => {
        this.moviesGenresMap[genre.id] = genre.name;
      });
    }
  }

  //! Adding all genres to advance filter select
  addGenresToFilter(genresList) {
    this.filterGenresContainer.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "همه";
    defaultOption.value = "";
    this.filterGenresContainer.appendChild(defaultOption);
    genresList.forEach((genre) => {
      const newGenreOption = document.createElement("option");
      newGenreOption.textContent = genre.name;
      newGenreOption.setAttribute("data-genre-id", genre.id);
      this.filterGenresContainer.appendChild(newGenreOption);
    });
  }
}
