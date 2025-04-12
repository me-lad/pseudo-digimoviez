//! Importing modules
import { GenreData } from "./GenreData.js";
import { LanguageData } from "./LanguageData.js";
import { CountryData } from "./CountryData.js";

//! Data manager class
export class DataManager {
  constructor() {
    this.sliderContainer = document.getElementById("slider-container");
    this.sliderReferenceElm = document.getElementById("slider-reference-elm");
    this.loadingFeature = document.querySelector(".body-loading");
    this.mainContainer = document.querySelector(".content-base__movies-items");
    this.asideContainer = document.querySelector(".content-base__series-items");
    this.mainReferenceElm = document.getElementById("movie-item-reference");
    this.asideReferenceElm = document.getElementById("sereie-item-reference");
    this.asideContainerTitle = document.querySelector(".content-base__series-title");
    this.countryOrLanguageSpan = document.getElementById("filter-langsCountries-span");
    this.paginationContainer = document.querySelector(".pagination");
    this.paginationInput = document.getElementById("pagination-range");
    this.isLoading = false;
    this.currentApi = null;
    this.currentMediaType = null;
    this.currentQyeriString = null;
    this.currentSearchString = null;
    this.currentPage = 1;
    this.totalPage = null;
    this.allTrendsData = [];
    this.languagesList = new LanguageData();
    this.genresList = new GenreData();
    this.countriesList = new CountryData();
    this.getTrendMoviesData();
    this.getTrendSeriesData();
    this.eventCaller();
  }
  eventCaller() {
    this.paginationContainer.addEventListener("click", this.getPaginationValue.bind(this));
    window.addEventListener("submit", this.getPaginationValue.bind(this));
  }

  //! Trend data getter
  async getTrendMoviesData() {
    this.loadingHandler("flex");
    try {
      this.isLoading = true;

      //! Fetching trends data
      this.currentApi = `https://api.themoviedb.org/3/trending/movie/week?`;
      const { data: response } = await axios.get(`${this.currentApi}page=1`);

      //! Getting all needed configurations
      await this.languagesList.getData();
      await this.genresList.getMoviesData();

      //! Calling all default functions
      this.completeSlider(response.results);
      this.showMainData(response.results, "movie");

      //! Updating project vaalues
      this.allTrendsData.push(...response.results);
      this.totalPage = response.total_pages > 500 ? 500 : response.total_pages;
      this.paginationInput.max = this.totalPage;
      this.currentMediaType = "movie";

      this.isLoading = false;
      this.loadingHandler("none");
    } catch (error) {
      console.error("Error", `${error.message}, ${error.code}`);
      this.isLoading = false;
      this.loadingHandler("none");
      this.mainContainer.innerHTML = `<p class="text-tertiary fs-16">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>`;
    }
  }

  async getTrendSeriesData() {
    this.loadingHandler("flex");
    try {
      this.isLoading = true;

      //! Fetching trends data
      const { data: response } = await axios.get(
        `https://api.themoviedb.org/3/trending/tv/week?page=1`
      );

      //! Getting all needed configurations
      await this.genresList.getSeriesData();
      await this.countriesList.getData();

      //! Calling all default functions
      this.showAsideData(response.results, "tv");

      //! Updating project vaalues
      this.allTrendsData.push(...response.results);

      this.isLoading = false;
      this.loadingHandler("none");
    } catch (error) {
      console.error("Error", `${error.message}, ${error.code}`);
      this.loadingHandler("none");
      this.isLoading = false;
      this.asideContainer.innerHTML = `<p class="text-tertiary fs-14 mt-2 text-center">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>`;
    }
  }

  //! Subsequent data getter
  async getSubsequentData(
    queryString = null,
    pageToGet = 1,
    searchString = null,
    mediaType = "movie"
  ) {
    this.loadingHandler("flex");
    this.isLoading = true;
    if (queryString) {
      this.currentSearchString = null;
      this.currentQyeriString = queryString;
      this.currentApi = `https://api.themoviedb.org/3/discover/${mediaType}?${queryString}`;
    } else if (searchString) {
      this.currentQyeriString = null;
      this.currentSearchString = searchString;
      this.currentApi = `https://api.themoviedb.org/3/search/${mediaType}?query=${searchString}`;
    }
    try {
      const response = await axios.get(`${this.currentApi}&page=${pageToGet}`);
      if ((response.status >= 200, response.status < 300)) {
        this.currentPage = pageToGet;
        this.currentMediaType = mediaType;
        this.showMainData(response.data.results, mediaType);
        this.showAsideData(this.allTrendsData, mediaType === "tv" ? "movie" : "tv");
        this.totalPage = response.data.total_pages > 500 ? 500 : response.data.total_pages;
        this.updatePaginationValues();
        this.paginationInput.max = this.totalPage;
        document.documentElement.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.loadingHandler("none");
        this.isLoading = false;
      }
    } catch (error) {
      const badReqMessage = error.response.data.status_message;
      const pattern = /max at [0-9]+/g;
      if (pattern.test(badReqMessage)) {
        const badReqMaxValue = badReqMessage.search(pattern);
        const newTotalPage = parseInt(badReqMessage.slice(badReqMaxValue + 7, badReqMaxValue + 11));
        this.totalPage = newTotalPage;
        this.paginationInput.max = this.totalPage;
        this.updatePaginationValues();
        alert(`صفحه مورد نظر یافت نشد؛ حداکثر مقدار مجاز برابر ${newTotalPage} می‌باشد.`);
      }
      console.error("Error", `${error.message}, ${error.code}`);
      this.isLoading = false;
      this.loadingHandler("none");
      this.mainContainer.innerHTML = `<p class="text-tertiary fs-16">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>`;
    }
  }

  //! Pagination methods
  getPaginationValue(event) {
    event.preventDefault();
    const target = event.target;
    let pageValue = this.currentPage;
    if (
      target.classList.contains("page-link") &&
      !target.classList.contains("disabled") &&
      !target.classList.contains("active") &&
      this.totalPage != 1 &&
      !this.isLoading
    ) {
      if (target.textContent === "صفحه‌بعدی") {
        pageValue++;
      } else if (target.textContent === "صفحه‌قبلی") {
        pageValue--;
      } else {
        pageValue = +target.textContent;
      }
      this.getSubsequentData(
        this.currentQyeriString,
        pageValue,
        this.currentSearchString,
        this.currentMediaType
      );
    } else if (target.tagName === "FORM" && this.totalPage != 1 && !this.isLoading) {
      pageValue = +target.children[0].value;
      target.children[0].value = 1;
      this.getSubsequentData(
        this.currentQyeriString,
        pageValue,
        this.currentSearchString,
        this.currentMediaType
      );
    }
  }

  updatePaginationValues() {
    const allNumberButtons = document.querySelectorAll(".page-link.numbering");
    const allOrderButtons = document.querySelectorAll(".page-link.goTo");
    this.paginationInput.value = 1;

    if (this.currentPage == 1) {
      allNumberButtons[0].textContent = 1;
      allNumberButtons[1].textContent = 2;
      allNumberButtons[2].textContent = 3;
    } else if (this.currentPage == this.totalPage && this.totalPage != 2) {
      allNumberButtons[0].textContent = this.currentPage - 2;
      allNumberButtons[1].textContent = this.currentPage - 1;
      allNumberButtons[2].textContent = this.currentPage;
    } else {
      allNumberButtons[0].textContent = this.currentPage - 1;
      allNumberButtons[1].textContent = this.currentPage;
      allNumberButtons[2].textContent = this.currentPage + 1;
    }

    allNumberButtons.forEach((button) => {
      button.classList.remove("active");
      button.classList.remove("disabled");
      if (button.textContent == this.currentPage) {
        button.classList.add("active");
      } else if (+button.textContent > this.totalPage) {
        button.classList.add("disabled");
      }
    });
    allOrderButtons.forEach((button) => {
      button.classList.remove("disabled");
      if (this.currentPage == 1) {
        allOrderButtons[0].classList.add("disabled");
      } else if (this.currentPage == this.totalPage) {
        allOrderButtons[1].classList.add("disabled");
      }
    });
  }

  //! Showing data
  showAsideData(dataList, mediaType = "tv") {
    if (mediaType === "movie") {
      this.asideContainer.innerHTML = ``;
      this.asideContainerTitle.textContent = "فیلم های محبوب";
      dataList.forEach((data) => {
        if (data.media_type === "movie") {
          const newAsideElm = document.importNode(this.asideReferenceElm.content, true),
            asidePoster = newAsideElm.getElementById("serie-poster"),
            asideName = newAsideElm.getElementById("serie-name");

          asidePoster.src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
          asideName.innerHTML = `دانلود فیلم ${data.title}
                          <span class="text-white"
                            > 10 / <strong id="serie-rate" class="text-tertiary fs-16">${data.vote_average.toFixed(
                              2
                            )}</strong
                          ></span>`;
          this.asideContainer.appendChild(newAsideElm);
        }
      });
    } else {
      this.asideContainer.innerHTML = ``;
      this.asideContainerTitle.textContent = "سریال های محبوب";
      dataList.forEach((data) => {
        if (data.media_type === "tv") {
          const newAsideElm = document.importNode(this.asideReferenceElm.content, true),
            asidePoster = newAsideElm.getElementById("serie-poster"),
            asideName = newAsideElm.getElementById("serie-name");

          asidePoster.src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
          asideName.innerHTML = `دانلود سریال ${data.name}
                          <span class="text-white"
                            > 10 / <strong id="serie-rate" class="text-tertiary fs-16">${data.vote_average.toFixed(
                              2
                            )}</strong
                          ></span>`;
          this.asideContainer.appendChild(newAsideElm);
        }
      });
    }
  }

  showMainData(dataList, mediaType = "movie") {
    this.mainContainer.innerHTML = "";
    if (dataList.length === 0) {
      this.mainContainer.innerHTML = `<p class="text-red fs-20 text-center">نتیجه‌ای یافت نشد.</p>`;
      return;
    }
    if (mediaType === "tv") {
      dataList.forEach((serie) => {
        const newMainElm = document.importNode(this.mainReferenceElm.content, true),
          mainImage = newMainElm.getElementById("movie-poster"),
          mainName = newMainElm.getElementById("movie-name"),
          mainRate = newMainElm.getElementById("movie-rate"),
          mainVote = newMainElm.getElementById("movie-vote-count"),
          mainRelease = newMainElm.getElementById("movie-releaseDate"),
          mainGenres = newMainElm.getElementById("movie-genre"),
          mainLanguage = newMainElm.getElementById("movie-language"),
          mainPopularity = newMainElm.getElementById("movie-popularity"),
          mainDescription = newMainElm.getElementById("movie-overview");

        mainImage.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
        mainName.textContent = `دانلود سریال ${serie.name}`;
        mainRate.textContent = serie.vote_average.toFixed(2);
        mainVote.textContent = `${serie.vote_count}K Votes`;
        mainRelease.textContent = serie.first_air_date;
        const mainGenreValue = serie.genre_ids
          .map((id) => this.genresList.seriesGenresMap[id])
          .join(", ");
        mainGenres.textContent = `ژانر : ${mainGenreValue}`;
        const mainCountryValue = this.countriesList.countriesMap[serie.origin_country[0]];
        mainLanguage.textContent = `کشور سازنده : ${mainCountryValue}`;
        mainPopularity.textContent = Math.round(serie.popularity);
        mainDescription.textContent = serie.overview;

        this.mainContainer.appendChild(newMainElm);
      });
    } else {
      dataList.forEach((movie) => {
        const newMainElm = document.importNode(this.mainReferenceElm.content, true),
          mainImage = newMainElm.getElementById("movie-poster"),
          mainName = newMainElm.getElementById("movie-name"),
          mainRate = newMainElm.getElementById("movie-rate"),
          mainVote = newMainElm.getElementById("movie-vote-count"),
          mainRelease = newMainElm.getElementById("movie-releaseDate"),
          mainGenres = newMainElm.getElementById("movie-genre"),
          mainLanguage = newMainElm.getElementById("movie-language"),
          mainPopularity = newMainElm.getElementById("movie-popularity"),
          mainDescription = newMainElm.getElementById("movie-overview");

        mainImage.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        mainName.textContent = `دانلود فیلم ${movie.title}`;
        mainRate.textContent = movie.vote_average.toFixed(2);
        mainVote.textContent = `${movie.vote_count}K Votes`;
        mainRelease.textContent = movie.release_date;
        const mainGenreValue = movie.genre_ids
          .map((id) => this.genresList.moviesGenresMap[id])
          .join(", ");
        mainGenres.textContent = `ژانر : ${mainGenreValue}`;
        const mainLanguageValue = this.languagesList.languagesMap[movie.original_language];
        mainLanguage.textContent = `زبان فیلم : ${mainLanguageValue}`;
        mainPopularity.textContent = Math.round(movie.popularity);
        mainDescription.textContent = movie.overview;

        this.mainContainer.appendChild(newMainElm);
      });
    }
  }

  completeSlider(trendsData) {
    this.sliderContainer.innerHTML = "";
    const toShowData = trendsData.slice(0, 10);
    toShowData.forEach((movie) => {
      const newSlide = document.importNode(this.sliderReferenceElm.content, true),
        slideBackground = newSlide.getElementById("slide-background"),
        slidePoster = newSlide.getElementById("slide-poster"),
        slideRate = newSlide.getElementById("slide-rate"),
        slideName = newSlide.getElementById("slide-name");

      slideBackground.src = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
      slidePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      slideRate.textContent = movie.vote_average.toFixed(2);
      slideName.textContent = `${movie.original_title} ${movie.release_date.slice(0, 4)}`;

      this.sliderContainer.appendChild(newSlide);
    });
    const swiperOptions = {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 2.5,
        slideShadows: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    };
    var swiper = new Swiper(".mySwiper", swiperOptions);
  }

  //! Loading feature handler
  loadingHandler(displayType) {
    this.loadingFeature.style.display = displayType;
  }
}
