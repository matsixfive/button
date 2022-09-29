import { writable } from "svelte/store";

export const cooldown = 5000; // cooldown in ms

const storedReady = localStorage.getItem("ready");

let storedReadyNum: number;

storedReadyNum = parseInt(storedReady) || Date.now() + cooldown;

export const ready = writable(storedReadyNum);

ready.subscribe((value) => {
	localStorage.setItem("ready", value.toString());
});
