import { writable } from "svelte/store";

export const defaultClicks = 10;

const storedClicksLeft = localStorage.getItem("clicksLeft");

let storedClicksLeftNum: number;

storedClicksLeftNum = isNaN(parseInt(storedClicksLeft, 10))
  ? defaultClicks
  : parseInt(storedClicksLeft, 10);

export const clicksLeft = writable(
  Math.min(storedClicksLeftNum, defaultClicks)
);

clicksLeft.subscribe(value => {
  localStorage.setItem("clicksLeft", value.toString());
});
