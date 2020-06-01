const IMAGE_ROOT: string = 'assets/images';

function preload(paths: string[]): Observable<HTMLImageElement> {
  return Observable.create(function (observer) {
    for (let i = 0; i < paths.length; i++) {
      let preloaded = new Image();
      preloaded.src = paths[i];
      observer.next(preloaded);
    }
    observer.complete();
  });
}

function preloadFlowers(): Observable<HTMLImageElement> {
  let species = this.speciesService.getAllSpecies();
  let paths = [];
  // get all valid breeding species phenotypes and preload them
  for (let i = 0; i < species.length; i++) {
    let speciesPath = ImagePreloaderService.IMAGE_ROOT + '/' + species[i].namePlural + '/' + species[i].name + '-';
    let colors = this.phenotypeService.getPossibleColors(species[i].id);
    for (let j = 0; j < colors.length; j++) {
      let fullPath = speciesPath + colors[j] + '.png';
      paths.push(fullPath);
    }
  }
  // also add gold rose because it will not be added above due to not being a valid breeding color.
  paths.push(ImagePreloaderService.IMAGE_ROOT + '/roses/rose-gold.png')
  return this.preload(paths);
}

export function preloadThreaded(paths: string[], nextCallback, completeCallback, shouldContinueCallback, stoppedCallback): void {
  for (let i = 0; i < paths.length; i++) {
    if (!shouldContinueCallback()) {
      stoppedCallback();
      return;
    }
    let preloaded = new Image();
    preloaded.src = paths[i];
    nextCallback(preloaded);
    if (!shouldContinueCallback()) {
      stoppedCallback();
      return;
    }
  }
  completeCallback();
}

// for older browsers that dont support workers; execute sims 1000 at a time
// then wait to give ui time to do things
export function simulateBreedingPairAsync(parent1: Flower, parent2: Flower, trials: number, nextCallback, completeCallback): number {
  let funcArgs = {
    parent1: parent1,
    parent2: parent2,
    trials: trials,
    nextCallback: nextCallback,
    completeCallback: completeCallback
  };
  let resultsTable = {};
  let start = 0;
  let end = 1000;
  let nextUpdateIntervalMs = 250;
  let startTime = new Date().getTime();
  let timer = setInterval(function doSimPart() {
      for (let i = start; i < end && i < funcArgs.trials; i++) {
        let child = breedFlowers(funcArgs.parent1, funcArgs.parent2);
        let color = getFlowerColor(child);
        if (!(color in resultsTable)) {
          resultsTable[color] = [];
        }
        let idx = genesToStringSequence(child.genes);
        if (!(idx in resultsTable[color])) {
          resultsTable[color][idx] = 0;
        }
        resultsTable[color][idx]++;
        let nowTime = new Date().getTime();
        if (nowTime - startTime > nextUpdateIntervalMs) {
          funcArgs.nextCallback({trials: i+1, results: resultsTable});
          startTime = nowTime;
        }
      }
      if (end >= funcArgs.trials) {
        clearInterval(timer);
        funcArgs.completeCallback({trials: funcArgs.trials, results: resultsTable});
      } else {
        start += 1000;
        end += 1000;
      }
  }, 50);
  return timer;
}
