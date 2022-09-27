import { writable } from "svelte/store";

export const defaultClicks = 10;

const storedClicksLeft = localStorage.getItem("clicksLeft");

let storedClicksLeftNum: number;

storedClicksLeftNum = parseInt(storedClicksLeft) || defaultClicks;

export const clicksLeft = writable(Math.min(storedClicksLeftNum, defaultClicks));

clicksLeft.subscribe((value) => {
	localStorage.setItem("clicksLeft", value.toString());
});
