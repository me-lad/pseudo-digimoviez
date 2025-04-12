const sideMenu = document.querySelector(".header__bottom-sideMenu");
const sideMenuBtnOpen = document.querySelector(".header__bottom-justify");
const sideMenuBtnClose = document.querySelector(".header__bottom-sideMenuCloser");
const bodyDarkCover = document.querySelector(".body-darkCover");
let timer = null;

sideMenuBtnOpen.addEventListener("click", () => {
  let right = -90;
  sideMenu.style.visibility = "visible";
  bodyDarkCover.style.display = "block";
  document.documentElement.style.overflow = "hidden";
  if (timer) {
    timer = null;
  }
  timer = setInterval(() => {
    if (right == 0) {
      clearInterval(timer);
    } else {
      right += 2;
      sideMenu.style.right = `${right}%`;
    }
  }, 5);
});
sideMenuBtnClose.addEventListener("click", () => {
  sideMenu.style.visibility = "hidden";
  sideMenu.style.right = "-100%";
  bodyDarkCover.style.display = "none";
  document.documentElement.style.overflow = "auto";
});
