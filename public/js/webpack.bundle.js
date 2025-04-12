/*! For license information please see webpack.bundle.js.LICENSE.txt */
(() => {
  "use strict";
  var e = {
    d: (t, i) => {
      for (var a in i) e.o(i, a) && !e.o(t, a) && Object.defineProperty(t, a, { enumerable: !0, get: i[a] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  e.d({}, { q: () => l });
  class t {
    constructor() {
      (this.mediaTypeButton = document.getElementById("filter-mediatype-button")),
        (this.mediaTypeInput = document.getElementById("filter-mediatype")),
        (this.filterSubmitBtn = document.getElementById("filter-button")),
        (this.filterMediaType = document.getElementById("filter-mediatype")),
        (this.filterLangCountry = document.getElementById("filter-language")),
        (this.filterAdult = document.getElementById("filter-adult")),
        (this.filterGenre = document.getElementById("filter-genre")),
        (this.filterSort = document.getElementById("filter-sort")),
        (this.filterMinYear = document.getElementById("filter-min-year")),
        (this.filterMaxYear = document.getElementById("filter-max-year")),
        (this.filterMinRate = document.getElementById("filter-min-rate")),
        (this.filterMaxRate = document.getElementById("filter-max-rate")),
        (this.searchCheckbox = document.getElementById("s1-14")),
        (this.searchInput = document.getElementById("search-input")),
        (this.searchResultsContainer = document.getElementById("header-searchResult")),
        (this.searchWatchAllBtn = document.querySelector(".header__bottom-search-watchAll")),
        (this.searchLoading = document.querySelector(".header__bottom-search-loading")),
        (this.timer = 0),
        this.eventCaller();
    }
    eventCaller() {
      this.mediaTypeButton.addEventListener("click", this.mediaTypeClickHandler.bind(this)),
        this.filterSubmitBtn.addEventListener("click", this.advanceFilterHandler.bind(this)),
        this.searchCheckbox.addEventListener("change", this.checkboxClickHandler.bind(this)),
        this.searchInput.addEventListener("input", this.searchDebouncer.bind(this)),
        this.searchWatchAllBtn.addEventListener("click", this.allResultsClickHandler.bind(this)),
        window.addEventListener("load", () => {
          (this.filterMediaType.value = "movie"),
            (this.filterLangCountry.value = ""),
            (this.filterAdult.value = "false"),
            (this.filterGenre.value = ""),
            (this.filterSort.value = ""),
            (this.filterMinYear.value = 1888),
            (this.filterMaxYear.value = 2024),
            (this.filterMinRate.value = 0),
            (this.filterMaxRate.value = 10),
            (this.searchCheckbox.checked = !1),
            (this.searchInput.value = ""),
            this.searchInput.setAttribute("data-searchtype", "movie");
        });
    }
    createQueryString() {
      let e = [
          { name: "include_adult", value: this.filterAdult.value },
          { name: "with_genres", value: this.filterGenre.selectedOptions[0].getAttribute("data-genre-id") },
          { name: "sort_by", value: this.filterSort.value },
          { name: "vote_average.gte", value: this.filterMinRate.value },
          { name: "vote_average.lte", value: this.filterMaxRate.value },
        ],
        t = [];
      return (
        "tv" === this.filterMediaType.value
          ? e.push(
              { name: "first_air_date.gte", value: `${this.filterMinYear.value}-01-01` },
              { name: "first_air_date.lte", value: `${this.filterMaxYear.value}-12-31` },
              { name: "with_origin_country", value: this.filterLangCountry.selectedOptions[0].getAttribute("data-iso-name") }
            )
          : e.push(
              { name: "primary_release_date.gte", value: `${this.filterMinYear.value}-01-01` },
              { name: "primary_release_date.lte", value: `${this.filterMaxYear.value}-12-31` },
              { name: "with_original_language", value: this.filterLangCountry.selectedOptions[0].getAttribute("data-iso-name") }
            ),
        e.forEach((e) => {
          e.value && "همه" != e.value && t.push(`${e.name}=${e.value}`);
        }),
        t.join("&")
      );
    }
    advanceFilterHandler() {
      const e = this.createQueryString(),
        t = this.filterMediaType.value;
      l.getDataCls().getSubsequentData(e, 1, null, t);
    }
    mediaTypeClickHandler(e) {
      const t = e.target;
      "BUTTON" == t.tagName &&
        (Array.from(this.mediaTypeButton.children).forEach((e) => e.classList.remove("active")),
        t.classList.toggle("active"),
        (this.mediaTypeInput.value = t.dataset.mediatype),
        "tv" === this.mediaTypeInput.value
          ? ((l.getDataCls().countryOrLanguageSpan.textContent = "کشور"),
            l.getDataCls().countriesList.addCountriesToFilter(l.getDataCls().countriesList.allCountriesList),
            l.getDataCls().genresList.addGenresToFilter(l.getDataCls().genresList.allSeriesGenresList))
          : ((l.getDataCls().countryOrLanguageSpan.textContent = "زبان"),
            l.getDataCls().languagesList.addLanguagesToFilter(l.getDataCls().languagesList.allLanguagesList),
            l.getDataCls().genresList.addGenresToFilter(l.getDataCls().genresList.allMoviesGenresList)));
    }
    async keyWordSearchHandler(e) {
      this.searchLoadingHandler("flex");
      try {
        const t = this.searchInput.getAttribute("data-searchtype");
        this.searchResultsContainer.innerHTML = "";
        const { data: i } = await axios.get(`https://api.themoviedb.org/3/search/${t}?query=${e}`);
        this.showSearchData(i.results), this.searchLoadingHandler("none");
      } catch (e) {
        console.error("Error", `${e.message}, ${e.code}`), this.searchLoadingHandler("none");
      }
    }
    searchDebouncer() {
      const e = this.searchInput.value;
      this.timer && clearTimeout(this.timer),
        (this.timer = setTimeout(() => {
          e.length >= 3
            ? this.keyWordSearchHandler(e)
            : ((this.searchResultsContainer.innerHTML = ""), (this.searchWatchAllBtn.style.display = "none"));
        }, 2500));
    }
    showSearchData(e) {
      const t = e.slice(0, 3);
      if (0 == t.length)
        return (
          (this.searchResultsContainer.innerHTML = '<p class="text-white fs-4 text-center mt-2">نتیجه ای یافت نشد</p>'),
          void (this.searchWatchAllBtn.style.display = "none")
        );
      t.forEach((e) => {
        const t = document.createElement("li");
        (t.className = "header__botton-search-item d-flex ai-c jc-end gap-4 py-3 cu-p"),
          (t.style.direction = "rtl"),
          (t.innerHTML = `<h3 class="text-white fs-15 d-flex ai-e jc-c gap-1 flex-column">\n                        ${(
            e.name || e.title
          ).slice(0, 40)}\n                        <small>${
            e.first_air_date || e.release_date
          }</small>\n                      </h3>\n                      <div class="f-center gap-3">\n                        <img\n                          class="rounded-4 object-fit-cover f-center text-white fs-12"\n                          style="width: 75px; height: 75px"\n                          src="https://image.tmdb.org/t/p/w500/${
            e.poster_path
          }"\n                          alt="No Poster"\n                        />\n                        <div class="f-center flex-column gap-2">\n                          <i class="fa-regular fa-star text-tertiary fs-17"></i>\n                          <span class="text-white fs-15">${e.vote_average.toFixed(
            2
          )}</span>\n                        </div>\n                      </div>`),
          this.searchResultsContainer.appendChild(t);
      }),
        (this.searchWatchAllBtn.style.display = "flex");
    }
    allResultsClickHandler() {
      const e = this.searchInput.value,
        t = this.searchInput.getAttribute("data-searchtype");
      l.getDataCls().getSubsequentData(null, 1, e, t),
        (this.searchResultsContainer.innerHTML = ""),
        (this.searchWatchAllBtn.style.display = "none"),
        (this.searchInput.value = ""),
        this.searchWatchAllBtn.removeEventListener("click", this.allResultsClickHandler);
    }
    checkboxClickHandler(e) {
      const t = e.currentTarget;
      t.checked
        ? ((t.value = "tv"), (this.searchInput.placeholder = "جستجو (سریال)"))
        : ((t.value = "movie"), (this.searchInput.placeholder = "جستجو (فیلم)")),
        this.searchInput.setAttribute("data-searchType", t.value),
        (this.searchResultsContainer.innerHTML = ""),
        (this.searchWatchAllBtn.style.display = "none"),
        (this.searchInput.value = "");
    }
    searchLoadingHandler(e) {
      this.searchLoading.style.display = e;
    }
  }
  class i {
    constructor() {
      (this.moviesGenresMap = {}),
        (this.seriesGenresMap = {}),
        (this.allMoviesGenresList = null),
        (this.allSeriesGenresList = null),
        (this.filterGenresContainer = document.getElementById("filter-genre"));
    }
    async getMoviesData() {
      const { data: e } = await axios.get("https://api.themoviedb.org/3/genre/movie/list");
      (this.allMoviesGenresList = e.genres), this.addGenresToFilter(e.genres), this.genresPair(e.genres, "movie");
    }
    async getSeriesData() {
      const { data: e } = await axios.get("https://api.themoviedb.org/3/genre/tv/list");
      (this.allSeriesGenresList = e.genres), this.genresPair(e.genres, "tv");
    }
    genresPair(e, t) {
      "tv" === t
        ? e.forEach((e) => {
            this.seriesGenresMap[e.id] = e.name;
          })
        : e.forEach((e) => {
            this.moviesGenresMap[e.id] = e.name;
          });
    }
    addGenresToFilter(e) {
      this.filterGenresContainer.innerHTML = "";
      const t = document.createElement("option");
      (t.textContent = "همه"),
        (t.value = ""),
        this.filterGenresContainer.appendChild(t),
        e.forEach((e) => {
          const t = document.createElement("option");
          (t.textContent = e.name), t.setAttribute("data-genre-id", e.id), this.filterGenresContainer.appendChild(t);
        });
    }
  }
  class a {
    constructor() {
      (this.languagesMap = {}),
        (this.allLanguagesList = null),
        (this.filterLanguagesContainer = document.getElementById("filter-language")),
        (this.baseApi = "https://api.themoviedb.org/3/configuration/languages");
    }
    async getData() {
      const { data: e } = await axios.get(this.baseApi);
      (this.allLanguagesList = e), this.addLanguagesToFilter(e), this.languagePair(e);
    }
    languagePair(e) {
      e.forEach((e) => {
        this.languagesMap[e.iso_639_1] = e.english_name;
      });
    }
    addLanguagesToFilter(e) {
      this.filterLanguagesContainer.innerHTML = "";
      const t = document.createElement("option");
      (t.textContent = "همه"),
        (t.value = ""),
        this.filterLanguagesContainer.appendChild(t),
        e.forEach((e) => {
          if ("No Language" !== e.english_name) {
            const t = document.createElement("option");
            (t.textContent = e.english_name),
              t.setAttribute("data-iso-name", e.iso_639_1),
              this.filterLanguagesContainer.appendChild(t);
          }
        });
    }
  }
  class n {
    constructor() {
      (this.countriesMap = {}),
        (this.allCountriesList = null),
        (this.filterCountriesContainer = document.getElementById("filter-language")),
        (this.baseApi = "https://api.themoviedb.org/3/configuration/countries");
    }
    async getData() {
      const { data: e } = await axios.get(this.baseApi);
      (this.allCountriesList = e), this.countriesPair(e);
    }
    countriesPair(e) {
      e.forEach((e) => {
        this.countriesMap[e.iso_3166_1] = e.native_name;
      });
    }
    addCountriesToFilter(e) {
      this.filterCountriesContainer.innerHTML = "";
      const t = document.createElement("option");
      (t.textContent = "همه"),
        (t.value = ""),
        this.filterCountriesContainer.appendChild(t),
        e.forEach((e) => {
          const t = document.createElement("option");
          (t.textContent = e.native_name),
            t.setAttribute("data-iso-name", e.iso_3166_1),
            this.filterCountriesContainer.appendChild(t);
        });
    }
  }
  class s {
    constructor() {
      (this.sliderContainer = document.getElementById("slider-container")),
        (this.sliderReferenceElm = document.getElementById("slider-reference-elm")),
        (this.loadingFeature = document.querySelector(".body-loading")),
        (this.mainContainer = document.querySelector(".content-base__movies-items")),
        (this.asideContainer = document.querySelector(".content-base__series-items")),
        (this.mainReferenceElm = document.getElementById("movie-item-reference")),
        (this.asideReferenceElm = document.getElementById("sereie-item-reference")),
        (this.asideContainerTitle = document.querySelector(".content-base__series-title")),
        (this.countryOrLanguageSpan = document.getElementById("filter-langsCountries-span")),
        (this.paginationContainer = document.querySelector(".pagination")),
        (this.paginationInput = document.getElementById("pagination-range")),
        (this.isLoading = !1),
        (this.currentApi = null),
        (this.currentMediaType = null),
        (this.currentQyeriString = null),
        (this.currentSearchString = null),
        (this.currentPage = 1),
        (this.totalPage = null),
        (this.allTrendsData = []),
        (this.languagesList = new a()),
        (this.genresList = new i()),
        (this.countriesList = new n()),
        this.getTrendMoviesData(),
        this.getTrendSeriesData(),
        this.eventCaller();
    }
    eventCaller() {
      this.paginationContainer.addEventListener("click", this.getPaginationValue.bind(this)),
        window.addEventListener("submit", this.getPaginationValue.bind(this));
    }
    async getTrendMoviesData() {
      this.loadingHandler("flex");
      try {
        (this.isLoading = !0), (this.currentApi = "https://api.themoviedb.org/3/trending/movie/week?");
        const { data: e } = await axios.get(`${this.currentApi}page=1`);
        await this.languagesList.getData(),
          await this.genresList.getMoviesData(),
          this.completeSlider(e.results),
          this.showMainData(e.results, "movie"),
          this.allTrendsData.push(...e.results),
          (this.totalPage = e.total_pages > 500 ? 500 : e.total_pages),
          (this.paginationInput.max = this.totalPage),
          (this.currentMediaType = "movie"),
          (this.isLoading = !1),
          this.loadingHandler("none");
      } catch (e) {
        console.error("Error", `${e.message}, ${e.code}`),
          (this.isLoading = !1),
          this.loadingHandler("none"),
          (this.mainContainer.innerHTML =
            '<p class="text-tertiary fs-16">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>');
      }
    }
    async getTrendSeriesData() {
      this.loadingHandler("flex");
      try {
        this.isLoading = !0;
        const { data: e } = await axios.get("https://api.themoviedb.org/3/trending/tv/week?page=1");
        await this.genresList.getSeriesData(),
          await this.countriesList.getData(),
          this.showAsideData(e.results, "tv"),
          this.allTrendsData.push(...e.results),
          (this.isLoading = !1),
          this.loadingHandler("none");
      } catch (e) {
        console.error("Error", `${e.message}, ${e.code}`),
          this.loadingHandler("none"),
          (this.isLoading = !1),
          (this.asideContainer.innerHTML =
            '<p class="text-tertiary fs-14 mt-2 text-center">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>');
      }
    }
    async getSubsequentData(e = null, t = 1, i = null, a = "movie") {
      this.loadingHandler("flex"),
        (this.isLoading = !0),
        e
          ? ((this.currentSearchString = null),
            (this.currentQyeriString = e),
            (this.currentApi = `https://api.themoviedb.org/3/discover/${a}?${e}`))
          : i &&
            ((this.currentQyeriString = null),
            (this.currentSearchString = i),
            (this.currentApi = `https://api.themoviedb.org/3/search/${a}?query=${i}`));
      try {
        const e = await axios.get(`${this.currentApi}&page=${t}`);
        e.status,
          e.status < 300 &&
            ((this.currentPage = t),
            (this.currentMediaType = a),
            this.showMainData(e.data.results, a),
            this.showAsideData(this.allTrendsData, "tv" === a ? "movie" : "tv"),
            (this.totalPage = e.data.total_pages > 500 ? 500 : e.data.total_pages),
            this.updatePaginationValues(),
            (this.paginationInput.max = this.totalPage),
            document.documentElement.scrollTo({ top: 0, behavior: "smooth" }),
            this.loadingHandler("none"),
            (this.isLoading = !1));
      } catch (e) {
        const t = e.response.data.status_message,
          i = /max at [0-9]+/g;
        if (i.test(t)) {
          const e = t.search(i),
            a = parseInt(t.slice(e + 7, e + 11));
          (this.totalPage = a),
            (this.paginationInput.max = this.totalPage),
            this.updatePaginationValues(),
            alert(`صفحه مورد نظر یافت نشد؛ حداکثر مقدار مجاز برابر ${a} می‌باشد.`);
        }
        console.error("Error", `${e.message}, ${e.code}`),
          (this.isLoading = !1),
          this.loadingHandler("none"),
          (this.mainContainer.innerHTML =
            '<p class="text-tertiary fs-16">دریافت اطلاعات با خطا مواجه شد لطفا دوباره تلاش کنید.</p>');
      }
    }
    getPaginationValue(e) {
      e.preventDefault();
      const t = e.target;
      let i = this.currentPage;
      !t.classList.contains("page-link") ||
      t.classList.contains("disabled") ||
      t.classList.contains("active") ||
      1 == this.totalPage ||
      this.isLoading
        ? "FORM" !== t.tagName ||
          1 == this.totalPage ||
          this.isLoading ||
          ((i = +t.children[0].value),
          (t.children[0].value = 1),
          this.getSubsequentData(this.currentQyeriString, i, this.currentSearchString, this.currentMediaType))
        : ("صفحه‌بعدی" === t.textContent ? i++ : "صفحه‌قبلی" === t.textContent ? i-- : (i = +t.textContent),
          this.getSubsequentData(this.currentQyeriString, i, this.currentSearchString, this.currentMediaType));
    }
    updatePaginationValues() {
      const e = document.querySelectorAll(".page-link.numbering"),
        t = document.querySelectorAll(".page-link.goTo");
      (this.paginationInput.value = 1),
        1 == this.currentPage
          ? ((e[0].textContent = 1), (e[1].textContent = 2), (e[2].textContent = 3))
          : this.currentPage == this.totalPage && 2 != this.totalPage
          ? ((e[0].textContent = this.currentPage - 2),
            (e[1].textContent = this.currentPage - 1),
            (e[2].textContent = this.currentPage))
          : ((e[0].textContent = this.currentPage - 1),
            (e[1].textContent = this.currentPage),
            (e[2].textContent = this.currentPage + 1)),
        e.forEach((e) => {
          e.classList.remove("active"),
            e.classList.remove("disabled"),
            e.textContent == this.currentPage
              ? e.classList.add("active")
              : +e.textContent > this.totalPage && e.classList.add("disabled");
        }),
        t.forEach((e) => {
          e.classList.remove("disabled"),
            1 == this.currentPage
              ? t[0].classList.add("disabled")
              : this.currentPage == this.totalPage && t[1].classList.add("disabled");
        });
    }
    showAsideData(e, t = "tv") {
      "movie" === t
        ? ((this.asideContainer.innerHTML = ""),
          (this.asideContainerTitle.textContent = "فیلم های محبوب"),
          e.forEach((e) => {
            if ("movie" === e.media_type) {
              const t = document.importNode(this.asideReferenceElm.content, !0),
                i = t.getElementById("serie-poster"),
                a = t.getElementById("serie-name");
              (i.src = `https://image.tmdb.org/t/p/w500/${e.poster_path}`),
                (a.innerHTML = `دانلود فیلم ${
                  e.title
                }\n                          <span class="text-white"\n                            > 10 / <strong id="serie-rate" class="text-tertiary fs-16">${e.vote_average.toFixed(
                  2
                )}</strong\n                          ></span>`),
                this.asideContainer.appendChild(t);
            }
          }))
        : ((this.asideContainer.innerHTML = ""),
          (this.asideContainerTitle.textContent = "سریال های محبوب"),
          e.forEach((e) => {
            if ("tv" === e.media_type) {
              const t = document.importNode(this.asideReferenceElm.content, !0),
                i = t.getElementById("serie-poster"),
                a = t.getElementById("serie-name");
              (i.src = `https://image.tmdb.org/t/p/w500/${e.poster_path}`),
                (a.innerHTML = `دانلود سریال ${
                  e.name
                }\n                          <span class="text-white"\n                            > 10 / <strong id="serie-rate" class="text-tertiary fs-16">${e.vote_average.toFixed(
                  2
                )}</strong\n                          ></span>`),
                this.asideContainer.appendChild(t);
            }
          }));
    }
    showMainData(e, t = "movie") {
      (this.mainContainer.innerHTML = ""),
        0 !== e.length
          ? "tv" === t
            ? e.forEach((e) => {
                const t = document.importNode(this.mainReferenceElm.content, !0),
                  i = t.getElementById("movie-poster"),
                  a = t.getElementById("movie-name"),
                  n = t.getElementById("movie-rate"),
                  s = t.getElementById("movie-vote-count"),
                  r = t.getElementById("movie-releaseDate"),
                  o = t.getElementById("movie-genre"),
                  l = t.getElementById("movie-language"),
                  h = t.getElementById("movie-popularity"),
                  d = t.getElementById("movie-overview");
                (i.src = `https://image.tmdb.org/t/p/w500/${e.poster_path}`),
                  (a.textContent = `دانلود سریال ${e.name}`),
                  (n.textContent = e.vote_average.toFixed(2)),
                  (s.textContent = `${e.vote_count}K Votes`),
                  (r.textContent = e.first_air_date);
                const c = e.genre_ids.map((e) => this.genresList.seriesGenresMap[e]).join(", ");
                o.textContent = `ژانر : ${c}`;
                const g = this.countriesList.countriesMap[e.origin_country[0]];
                (l.textContent = `کشور سازنده : ${g}`),
                  (h.textContent = Math.round(e.popularity)),
                  (d.textContent = e.overview),
                  this.mainContainer.appendChild(t);
              })
            : e.forEach((e) => {
                const t = document.importNode(this.mainReferenceElm.content, !0),
                  i = t.getElementById("movie-poster"),
                  a = t.getElementById("movie-name"),
                  n = t.getElementById("movie-rate"),
                  s = t.getElementById("movie-vote-count"),
                  r = t.getElementById("movie-releaseDate"),
                  o = t.getElementById("movie-genre"),
                  l = t.getElementById("movie-language"),
                  h = t.getElementById("movie-popularity"),
                  d = t.getElementById("movie-overview");
                (i.src = `https://image.tmdb.org/t/p/w500/${e.poster_path}`),
                  (a.textContent = `دانلود فیلم ${e.title}`),
                  (n.textContent = e.vote_average.toFixed(2)),
                  (s.textContent = `${e.vote_count}K Votes`),
                  (r.textContent = e.release_date);
                const c = e.genre_ids.map((e) => this.genresList.moviesGenresMap[e]).join(", ");
                o.textContent = `ژانر : ${c}`;
                const g = this.languagesList.languagesMap[e.original_language];
                (l.textContent = `زبان فیلم : ${g}`),
                  (h.textContent = Math.round(e.popularity)),
                  (d.textContent = e.overview),
                  this.mainContainer.appendChild(t);
              })
          : (this.mainContainer.innerHTML = '<p class="text-red fs-20 text-center">نتیجه‌ای یافت نشد.</p>');
    }
    completeSlider(e) {
      (this.sliderContainer.innerHTML = ""),
        e.slice(0, 10).forEach((e) => {
          const t = document.importNode(this.sliderReferenceElm.content, !0),
            i = t.getElementById("slide-background"),
            a = t.getElementById("slide-poster"),
            n = t.getElementById("slide-rate"),
            s = t.getElementById("slide-name");
          (i.src = `https://image.tmdb.org/t/p/w1280${e.backdrop_path}`),
            (a.src = `https://image.tmdb.org/t/p/w500${e.poster_path}`),
            (n.textContent = e.vote_average.toFixed(2)),
            (s.textContent = `${e.original_title} ${e.release_date.slice(0, 4)}`),
            this.sliderContainer.appendChild(t);
        }),
        new Swiper(".mySwiper", {
          effect: "coverflow",
          grabCursor: !0,
          centeredSlides: !0,
          loop: !0,
          slidesPerView: "auto",
          coverflowEffect: { rotate: 0, stretch: 0, depth: 150, modifier: 2.5, slideShadows: !0 },
          autoplay: { delay: 4e3, disableOnInteraction: !1 },
          navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
    }
    loadingHandler(e) {
      this.loadingFeature.style.display = e;
    }
  }
  class r {
    constructor() {
      (this.themeChangerBtn = document.querySelector(".header__top-themeChanger")),
        (this.themeChangerCircle = document.querySelector(".header__top-themeChanger-switch")),
        (this.activeTheme = "dark"),
        this.eventCaller(),
        this.getStorage();
    }
    eventCaller() {
      this.themeChangerBtn.addEventListener("click", this.themeHandler.bind(this));
    }
    themeHandler(e) {
      e && "click" === e.type
        ? ("dark" === this.activeTheme
            ? ((this.activeTheme = "light"),
              document.body.classList.toggle("light-mode"),
              (this.themeChangerCircle.style.left = "56%"))
            : ((this.activeTheme = "dark"),
              document.body.classList.toggle("light-mode"),
              (this.themeChangerCircle.style.left = "11%")),
          this.setStorage())
        : "dark" === this.activeTheme
        ? (document.body.classList.remove("light-mode"), (this.themeChangerCircle.style.left = "11%"))
        : (document.body.classList.add("light-mode"), (this.themeChangerCircle.style.left = "56%"));
    }
    setStorage() {
      localStorage.setItem("theme", this.activeTheme);
    }
    getStorage() {
      localStorage.getItem("theme") && ((this.activeTheme = localStorage.getItem("theme")), this.themeHandler());
    }
  }
  class o {
    constructor() {
      this.setApiHeader(), this.showFirstMessage(), (this.data = new s()), (this.advanceSearch = new t()), (this.theme = new r());
    }
    setApiHeader() {
      (axios.defaults.headers.common.accept = "application/json"), (axios.defaults.headers.common.Authorization = "Bearer ");
    }
    showFirstMessage() {
      const e = document.querySelector(".first-loading");
      localStorage.getItem("hasAlreadyLoad") ||
        (localStorage.setItem("hasAlreadyLoad", !0),
        e.classList.remove("hidden"),
        setTimeout(() => {
          e.classList.add("hidden");
        }, 3e3));
    }
  }
  class l {
    static init() {
      this.theBase = new o();
    }
    static getDataCls() {
      return this.theBase.data;
    }
  }
  l.init();
})();
