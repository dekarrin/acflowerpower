/// <reference lib="webworker" />

let keepRunning = true;
let curRunning = false;

import { simulateBreedingPairThreaded } from '../lib/breeding';

addEventListener('message', ({data}) => {
  if (data.message === "start") {
    keepRunning = true;
    curRunning = true;
    simulateBreedingPairThreaded(data.data.flower1, data.data.flower2, data.data.trials,
      x => postMessage({message: "next", data: x}),
      x => postMessage({message: "complete", data: x}),
      () => keepRunning,
      () => curRunning = false
    )
  }
});
