//! Importing modules
import { App } from "../App.js";

//! Advance search class
export class AdvanceSearch {
  constructor() {
    this.mediaTypeButton = document.getElementById("filter-mediatype-button");
    this.mediaTypeInput = document.getElementById("filter-mediatype");
    this.filterSubmitBtn = document.getElementById("filter-button");
    this.filterMediaType = document.getElementById("filter-mediatype");
    this.filterLangCountry = document.getElementById("filter-language");
    this.filterAdult = document.getElementById("filter-adult");
    this.filterGenre = document.getElementById("filter-genre");
    this.filterSort = document.getElementById("filter-sort");
    this.filterMinYear = document.getElementById("filter-min-year");
    this.filterMaxYear = document.getElementById("filter-max-year");
    this.filterMinRate = document.getElementById("filter-min-rate");
    this.filterMaxRate = document.getElementById("filter-max-rate");
    this.searchCheckbox = document.getElementById("s1-14");
    this.searchInput = document.getElementById("search-input");
    this.searchResultsContainer = document.getElementById("header-searchResult");
    this.searchWatchAllBtn = document.querySelector(".header__bottom-search-watchAll");
    this.searchLoading = document.querySelector(".header__bottom-search-loading");
    this.timer = 0;
    this.eventCaller();
  }
  eventCaller() {
    this.mediaTypeButton.addEventListener("click", this.mediaTypeClickHandler.bind(this));
    this.filterSubmitBtn.addEventListener("click", this.advanceFilterHandler.bind(this));
    this.searchCheckbox.addEventListener("change", this.checkboxClickHandler.bind(this));
    this.searchInput.addEventListener("input", this.searchDebouncer.bind(this));
    this.searchWatchAllBtn.addEventListener("click", this.allResultsClickHandler.bind(this));
    window.addEventListener("load", () => {
      this.filterMediaType.value = "movie";
      this.filterLangCountry.value = "";
      this.filterAdult.value = "false";
      this.filterGenre.value = "";
      this.filterSort.value = "";
      this.filterMinYear.value = 1888;
      this.filterMaxYear.value = 2024;
      this.filterMinRate.value = 0;
      this.filterMaxRate.value = 10;
      this.searchCheckbox.checked = false;
      this.searchInput.value = "";
      this.searchInput.setAttribute("data-searchtype", "movie");
    });
  }

  //! Advance filter
  createQueryString() {
    let parameters = [
      {
        name: "include_adult",
        value: this.filterAdult.value,
      },
      {
        name: "with_genres",
        value: this.filterGenre.selectedOptions[0].getAttribute("data-genre-id"),
      },
      {
        name: "sort_by",
        value: this.filterSort.value,
      },
      {
        name: "vote_average.gte",
        value: this.filterMinRate.value,
      },
      {
        name: "vote_average.lte",
        value: this.filterMaxRate.value,
      },
    ];
    let filterParameters = [];
    if (this.filterMediaType.value === "tv") {
      parameters.push(
        ...[
          {
            name: "first_air_date.gte",
            value: `${this.filterMinYear.value}-01-01`,
          },
          {
            name: "first_air_date.lte",
            value: `${this.filterMaxYear.value}-12-31`,
          },
          {
            name: "with_origin_country",
            value: this.filterLangCountry.selectedOptions[0].getAttribute("data-iso-name"),
          },
        ]
      );
    } else {
      parameters.push(
        ...[
          {
            name: "primary_release_date.gte",
            value: `${this.filterMinYear.value}-01-01`,
          },
          {
            name: "primary_release_date.lte",
            value: `${this.filterMaxYear.value}-12-31`,
          },
          {
            name: "with_original_language",
            value: this.filterLangCountry.selectedOptions[0].getAttribute("data-iso-name"),
          },
        ]
      );
    }
    parameters.forEach((parameter) => {
      if (parameter.value && parameter.value != "همه") {
        filterParameters.push(`${parameter.name}=${parameter.value}`);
      }
    });
    return filterParameters.join("&");
  }

  advanceFilterHandler() {
    const generatedQueryString = this.createQueryString();
    const targetMediaType = this.filterMediaType.value;
    App.getDataCls().getSubsequentData(generatedQueryString, 1, null, targetMediaType);
  }

  mediaTypeClickHandler(event) {
    const target = event.target;
    if (target.tagName == "BUTTON") {
      Array.from(this.mediaTypeButton.children).forEach((elm) => elm.classList.remove("active"));
      target.classList.toggle("active");
      this.mediaTypeInput.value = target.dataset.mediatype;
      if (this.mediaTypeInput.value === "tv") {
        App.getDataCls().countryOrLanguageSpan.textContent = "کشور";
        App.getDataCls().countriesList.addCountriesToFilter(App.getDataCls().countriesList.allCountriesList);
        App.getDataCls().genresList.addGenresToFilter(App.getDataCls().genresList.allSeriesGenresList);
      } else {
        App.getDataCls().countryOrLanguageSpan.textContent = "زبان";
        App.getDataCls().languagesList.addLanguagesToFilter(App.getDataCls().languagesList.allLanguagesList);
        App.getDataCls().genresList.addGenresToFilter(App.getDataCls().genresList.allMoviesGenresList);
      }
    }
  }

  //! Keyword search
  async keyWordSearchHandler(searchValue) {
    this.searchLoadingHandler("flex");
    try {
      const searchType = this.searchInput.getAttribute("data-searchtype");
      this.searchResultsContainer.innerHTML = "";
      const { data: response } = await axios.get(
        `https://api.themoviedb.org/3/search/${searchType}?query=${searchValue}`
      );
      this.showSearchData(response.results);
      this.searchLoadingHandler("none");
    } catch (error) {
      console.error("Error", `${error.message}, ${error.code}`);
      this.searchLoadingHandler("none");
    }
  }

  searchDebouncer() {
    const generatedSearchString = this.searchInput.value;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (generatedSearchString.length >= 3) {
        this.keyWordSearchHandler(generatedSearchString);
      } else {
        this.searchResultsContainer.innerHTML = ``;
        this.searchWatchAllBtn.style.display = "none";
      }
    }, 2500);
  }

  showSearchData(dataList) {
    const toShowData = dataList.slice(0, 3);
    if (toShowData.length == 0) {
      this.searchResultsContainer.innerHTML = `<p class="text-white fs-4 text-center mt-2">نتیجه ای یافت نشد</p>`;
      this.searchWatchAllBtn.style.display = "none";
      return;
    }
    toShowData.forEach((data) => {
      const newFindedElm = document.createElement("li");
      newFindedElm.className = "header__botton-search-item d-flex ai-c jc-end gap-4 py-3 cu-p";
      newFindedElm.style.direction = "rtl";
      newFindedElm.innerHTML = `<h3 class="text-white fs-15 d-flex ai-e jc-c gap-1 flex-column">
                        ${(data.name || data.title).slice(0, 40)}
                        <small>${data.first_air_date || data.release_date}</small>
                      </h3>
                      <div class="f-center gap-3">
                        <img
                          class="rounded-4 object-fit-cover f-center text-white fs-12"
                          style="width: 75px; height: 75px"
                          src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                          alt="No Poster"
                        />
                        <div class="f-center flex-column gap-2">
                          <i class="fa-regular fa-star text-tertiary fs-17"></i>
                          <span class="text-white fs-15">${data.vote_average.toFixed(2)}</span>
                        </div>
                      </div>`;
      this.searchResultsContainer.appendChild(newFindedElm);
    });
    this.searchWatchAllBtn.style.display = "flex";
  }

  allResultsClickHandler() {
    const searchString = this.searchInput.value;
    const mediaType = this.searchInput.getAttribute("data-searchtype");
    App.getDataCls().getSubsequentData(null, 1, searchString, mediaType);
    this.searchResultsContainer.innerHTML = ``;
    this.searchWatchAllBtn.style.display = "none";
    this.searchInput.value = "";
    this.searchWatchAllBtn.removeEventListener("click", this.allResultsClickHandler);
  }

  checkboxClickHandler(event) {
    const target = event.currentTarget;
    if (target.checked) {
      target.value = "tv";
      this.searchInput.placeholder = "جستجو (سریال)";
    } else {
      target.value = "movie";
      this.searchInput.placeholder = "جستجو (فیلم)";
    }
    this.searchInput.setAttribute("data-searchType", target.value);
    this.searchResultsContainer.innerHTML = ``;
    this.searchWatchAllBtn.style.display = "none";
    this.searchInput.value = "";
  }

  searchLoadingHandler(displayType) {
    this.searchLoading.style.display = displayType;
  }
}
