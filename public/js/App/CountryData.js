//! Country data class
export class CountryData {
  constructor() {
    this.countriesMap = {};
    this.allCountriesList = null;
    this.filterCountriesContainer = document.getElementById("filter-language");
    this.baseApi = "https://api.themoviedb.org/3/configuration/countries";
  }

  //! Genres data getter
  async getData() {
    const { data: response } = await axios.get(this.baseApi);
    this.allCountriesList = response;
    this.countriesPair(response);
  }

  //! Pairing genres name and iso_name
  countriesPair(countriesList) {
    countriesList.forEach((country) => {
      this.countriesMap[country.iso_3166_1] = country.native_name;
    });
  }

  //! Adding all genres to advance filter select
  addCountriesToFilter(countriesList) {
    this.filterCountriesContainer.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "همه";
    defaultOption.value = "";
    this.filterCountriesContainer.appendChild(defaultOption);
    countriesList.forEach((country) => {
      const newCountryOption = document.createElement("option");
      newCountryOption.textContent = country.native_name;
      newCountryOption.setAttribute("data-iso-name", country.iso_3166_1);
      this.filterCountriesContainer.appendChild(newCountryOption);
    });
  }
}
