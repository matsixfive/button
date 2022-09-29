import { writable } from "svelte/store";

const storedWins = localStorage.getItem("wins");

let storedWinsNum: number;

storedWinsNum = parseInt(storedWins, 10) || 0;

export const wins = writable(storedWinsNum);

wins.subscribe((value) => {
	localStorage.setItem("wins", value.toString());
});
