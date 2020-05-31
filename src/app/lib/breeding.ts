import { Flower } from '../flower';
import { SpeciesId } from '../species';
import { PHENOTYPE_DEFINITIONS } from '../data/phenotypes';
import { Color } from '../color';

export type SinglePairSimResult = {[K in Color]?: {[k: string]: number}};

export interface Progress<T> {
  trials: number;
  results: T
}

export function getFlowerColor(f: Flower) {
  return getColorByGenes(f.species.id, f.genes);
}

export function getColorByGenes(speciesId: SpeciesId, genes: number[]): Color {
  // WARNING: we are losing compile-time type-safety here.
  let color: any = PHENOTYPE_DEFINITIONS[speciesId];
  for (let i = 0; i < genes.length; i++) {
    color = color[genes[i]];
  }
  return color;
}

export function stringSequenceToGenes(seq: string): number[] {
  let genes = [];
  for (let i = 0; i < seq.length; i++) {
    let num = parseInt(seq[i]);
    genes.push(num);
  }
  return genes;
}

export function genesToStringSequence(genes: number[]): string {
  let seq = "";
  for (let i = 0; i < genes.length; i++) {
    seq += String(genes[i]);
  }
  return seq;
}

function randRange(min: number, max: number) {
  return (Math.random() * (max - min)) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(randRange(Math.floor(min), Math.floor(max + 1)));
}

function recombineGenes(g1: number, g2: number): number {
  let allele1: number;
  let allele2: number;
  if (g1 === 0) {
    allele1 = 0;
  } else if (g1 === 2) {
    allele1 = 1;
  } else {
    allele1 = randInt(0, 1);
  }
  if (g2 === 0) {
    allele2 = 0;
  } else if (g2 === 2) {
    allele2 = 1;
  } else {
    allele2 = randInt(0, 1);
  }
  let new_gene = allele1 + allele2;
  return new_gene;
}

function breedGenes(parent1: number[], parent2: number[]): number[] {
  let child_genes = [];
  for (let i = 0; i < Math.min(parent1.length, parent2.length); i++) {
    let gene = recombineGenes(parent1[i], parent2[i]);
    child_genes.push(gene);
  }
  return child_genes;
}

export function breedFlowers(parent1: Flower, parent2: Flower): Flower {
  if (parent1.species.id !== parent2.species.id) {
    throw 'Parents of different species cannot breed';
  }
  let child_flower = {species: parent1.species, genes: breedGenes(parent1.genes, parent2.genes)};
  return child_flower;
}

export function simulateBreedingPairThreaded(parent1: Flower, parent2: Flower, trials: number, nextCallback, completeCallback, shouldContinueCallback, stoppedCallback): void {
  let resultsTable = {};
  let nextUpdateIntervalMs = 250;
  let startTime = new Date().getTime();
  for (let i = 0; i < trials; i++) {
    if (!shouldContinueCallback()) {
      console.log("STOP1");
      stoppedCallback();
      return;
    }
    let child = breedFlowers(parent1, parent2);
    let color = getFlowerColor(child);
    if (!(color in resultsTable)) {
      resultsTable[color] = [];
    }
    let idx = genesToStringSequence(child.genes);
    if (!(idx in resultsTable[color])) {
      resultsTable[color][idx] = 0;
    }
    resultsTable[color][idx]++;
    if (!shouldContinueCallback()) {

      console.log("STOP2");
      stoppedCallback();
      return;
    }
    let nowTime = new Date().getTime();
    if (nowTime - startTime > nextUpdateIntervalMs) {
      nextCallback({trials: i+1, results: resultsTable});
      startTime = nowTime;
    }
  }
  completeCallback({trials: trials, results: resultsTable});
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
