//! Theme class
export class Theme {
  constructor() {
    this.themeChangerBtn = document.querySelector(".header__top-themeChanger");
    this.themeChangerCircle = document.querySelector(".header__top-themeChanger-switch");
    this.activeTheme = "dark";
    this.eventCaller();
    this.getStorage();
  }
  eventCaller() {
    this.themeChangerBtn.addEventListener("click", this.themeHandler.bind(this));
  }

  themeHandler(event) {
    if (event && event.type === "click") {
      if (this.activeTheme === "dark") {
        this.activeTheme = "light";
        document.body.classList.toggle("light-mode");
        this.themeChangerCircle.style.left = "56%";
      } else {
        this.activeTheme = "dark";
        document.body.classList.toggle("light-mode");
        this.themeChangerCircle.style.left = "11%";
      }
      this.setStorage();
    } else {
      if (this.activeTheme === "dark") {
        document.body.classList.remove("light-mode");
        this.themeChangerCircle.style.left = "11%";
      } else {
        document.body.classList.add("light-mode");
        this.themeChangerCircle.style.left = "56%";
      }
    }
  }

  setStorage() {
    localStorage.setItem("theme", this.activeTheme);
  }

  getStorage() {
    if (localStorage.getItem("theme")) {
      this.activeTheme = localStorage.getItem("theme");
      this.themeHandler();
    }
  }
}
