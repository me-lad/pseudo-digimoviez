//! Language data class
export class LanguageData {
  constructor() {
    this.languagesMap = {};
    this.allLanguagesList = null;
    this.filterLanguagesContainer = document.getElementById("filter-language");
    this.baseApi = "https://api.themoviedb.org/3/configuration/languages";
  }

  //! Languages data getter
  async getData() {
    const { data: response } = await axios.get(this.baseApi);
    this.allLanguagesList = response;
    this.addLanguagesToFilter(response);
    this.languagePair(response);
  }

  //! Pairing languages name and iso_name
  languagePair(languagesList) {
    languagesList.forEach((language) => {
      this.languagesMap[language.iso_639_1] = language.english_name;
    });
  }

  //! Adding all langs to advance filter select
  addLanguagesToFilter(languagesList) {
    this.filterLanguagesContainer.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "همه";
    defaultOption.value = "";
    this.filterLanguagesContainer.appendChild(defaultOption);
    languagesList.forEach((language) => {
      if (language.english_name !== "No Language") {
        const newLanguageOption = document.createElement("option");
        newLanguageOption.textContent = language.english_name;
        newLanguageOption.setAttribute("data-iso-name", language.iso_639_1);
        this.filterLanguagesContainer.appendChild(newLanguageOption);
      }
    });
  }
}
