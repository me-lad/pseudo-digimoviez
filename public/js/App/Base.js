//! Importing modules
import { AdvanceSearch } from "../App/AdvanceSearch.js";
import { DataManager } from "../App/DataManager.js";
import { Theme } from "../App/Theme.js";

//! Base classes
export class Base {
  constructor() {
    this.setApiHeader();
    this.showFirstMessage();
    this.data = new DataManager();
    this.advanceSearch = new AdvanceSearch();
    this.theme = new Theme();
  }

  //! Api head setter
  setApiHeader() {
    axios.defaults.headers.common["accept"] = "application/json";
    axios.defaults.headers.common["Authorization"] = "Bearer ";
  }

  //! Showing the custom message on the first loading
  showFirstMessage() {
    const message = document.querySelector(".first-loading");
    const hasAlreadyLoad = localStorage.getItem("hasAlreadyLoad");
    if (!!hasAlreadyLoad) {
      return;
    }
    localStorage.setItem("hasAlreadyLoad", true);
    message.classList.remove("hidden");
    setTimeout(() => {
      message.classList.add("hidden");
    }, 3000);
  }
}
