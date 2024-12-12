//! Importing modules
import { AdvanceSearch } from "../App/AdvanceSearch.js";
import { DataManager } from "../App/DataManager.js";
import { Theme } from "../App/Theme.js";

//! Base classes
export class Base {
  constructor() {
    this.setApiHeader();
    this.data = new DataManager();
    this.advanceSearch = new AdvanceSearch();
    this.theme = new Theme();
  }

  //! Api head setter
  setApiHeader() {
    axios.defaults.headers.common["accept"] = "application/json";
    axios.defaults.headers.common["Authorization"] =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MmQzN2Q0NDFlNDNjNDBmMTg3MzNiYzI1NTA2MjAwNiIsIm5iZiI6MTcyMjYxNDIzNS43NzIzNDcsInN1YiI6IjY2YWNmZWZlNWFlNjk0NDVjN2NkODRhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hKEo1l_TXQQiK8_nqilFpGSv1Ygi5hlhwHfSua-PabU";
  }
}
