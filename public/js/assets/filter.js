const rangeYear = document.getElementById("range-year");
const rangeYearInside = document.getElementById("range-year-inside");
const minThumb = document.getElementById("thumb-min-year");
const maxThumb = document.getElementById("thumb-max-year");
const minInput = document.getElementById("filter-min-year");
const maxInput = document.getElementById("filter-max-year");
const minSpan = document.getElementById("min-year");
const maxSpan = document.getElementById("max-year");

let minValue = 1888;
let maxValue = 2024;
let minPos = 0;
let maxPos = 100;
const minMaxDiff = maxValue - minValue;

const updateFiltersValue = () => {
  minInput.value = Math.round(minValue);
  maxInput.value = Math.round(maxValue);
  minSpan.textContent = Math.round(minValue);
  maxSpan.textContent = Math.round(maxValue);
  minThumb.style.left = `${minPos}%`;
  maxThumb.style.left = `${maxPos}%`;
  rangeYearInside.style.width = `${maxPos - minPos}%`;
  rangeYearInside.style.left = `${minPos + 2}%`;
};

const maxThumbHandler = (event) => {
  const rect = rangeYear.getBoundingClientRect();
  maxPos = ((event.clientX - rect.left) / rect.width) * 100;
  if (event.type === "touchmove") {
    maxPos = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
  }
  maxPos = Math.max(minPos, Math.min(maxPos, 100));
  maxValue = (maxPos / 100) * minMaxDiff + 1888;
  updateFiltersValue();
};
const minThumbHandler = (event) => {
  const rect = rangeYear.getBoundingClientRect();
  minPos = ((event.clientX - rect.left) / rect.width) * 100;
  if (event.type === "touchmove") {
    minPos = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
  }
  minPos = Math.max(0, Math.min(minPos, maxPos));
  minValue = (minPos / 100) * minMaxDiff + 1888;
  updateFiltersValue();
};

const betweenThumbsHandler = (event) => {
  const rect = rangeYear.getBoundingClientRect();
  const totalWidth = rect.left + rect.width;

  if (event.x > totalWidth / 2 + 60) {
    maxThumbHandler(event);
  } else {
    minThumbHandler(event);
  }
};

rangeYear.addEventListener("mousedown", (event) => {
  const target = event.target;
  if (target === maxThumb) {
    document.addEventListener("mousemove", maxThumbHandler);
  } else if (target === minThumb) {
    document.addEventListener("mousemove", minThumbHandler);
  } else {
    target.addEventListener("click", betweenThumbsHandler);
  }
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", maxThumbHandler);
    document.removeEventListener("mousemove", minThumbHandler);
  });
});
minThumb.addEventListener("touchmove", minThumbHandler);
maxThumb.addEventListener("touchmove", maxThumbHandler);

//!

const rangeRate = document.getElementById("range-rate");
const rangeRateInside = document.getElementById("range-rate-inside");
const minThumbRate = document.getElementById("thumb-min-rate");
const maxThumbRate = document.getElementById("thumb-max-rate");
const minInputRate = document.getElementById("filter-min-rate");
const maxInputRate = document.getElementById("filter-max-rate");
const minSpanRate = document.getElementById("min-rate");
const maxSpanRate = document.getElementById("max-rate");

let minValueRate = 0;
let maxValueRate = 10;
let minPosRate = 0;
let maxPosRate = 100;
const minMaxDiffRate = maxValueRate - minValueRate;

const updateFiltersValueRate = () => {
  minInputRate.value = Math.round(minValueRate);
  maxInputRate.value = Math.round(maxValueRate);
  minSpanRate.textContent = Math.round(minValueRate);
  maxSpanRate.textContent = Math.round(maxValueRate);
  minThumbRate.style.left = `${minPosRate}%`;
  maxThumbRate.style.left = `${maxPosRate}%`;
  rangeRateInside.style.width = `${maxPosRate - minPosRate}%`;
  rangeRateInside.style.left = `${minPosRate + 2}%`;
};

const maxThumbHandlerRate = (event) => {
  const rect = rangeRate.getBoundingClientRect();
  maxPosRate = ((event.clientX - rect.left) / rect.width) * 100;
  if (event.type === "touchmove") {
    maxPosRate = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
  }
  maxPosRate = Math.max(minPosRate, Math.min(maxPosRate, 100));
  maxValueRate = maxPosRate / 10;
  updateFiltersValueRate();
};

const minThumbHandlerRate = (event) => {
  const rect = rangeRate.getBoundingClientRect();
  minPosRate = ((event.clientX - rect.left) / rect.width) * 100;
  if (event.type === "touchmove") {
    minPosRate = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
  }
  minPosRate = Math.max(0, Math.min(minPosRate, maxPosRate));
  minValueRate = minPosRate / 10;
  updateFiltersValueRate();
};

const betweenThumbsHandlerRate = (event) => {
  const rect = rangeRate.getBoundingClientRect();
  const totalWidth = rect.left + rect.width;
  if (event.x > totalWidth / 2 + 60) {
    maxThumbHandlerRate(event);
  } else {
    minThumbHandlerRate(event);
  }
};

rangeRate.addEventListener("mousedown", (event) => {
  const target = event.target;
  if (target === maxThumbRate) {
    document.addEventListener("mousemove", maxThumbHandlerRate);
  } else if (target === minThumbRate) {
    document.addEventListener("mousemove", minThumbHandlerRate);
  } else {
    target.addEventListener("click", betweenThumbsHandlerRate);
  }
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", maxThumbHandlerRate);
    document.removeEventListener("mousemove", minThumbHandlerRate);
  });
});
minThumbRate.addEventListener("touchmove", minThumbHandlerRate);
maxThumbRate.addEventListener("touchmove", maxThumbHandlerRate);
