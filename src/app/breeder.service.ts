import { Injectable } from '@angular/core';

import { Flower } from './flower';

function randRange(min: number, max: number) {
  return (Math.random() * (max - min)) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(randRange(Math.floor(min), Math.floor(max + 1)));
}

@Injectable({
  providedIn: 'root'
})
export class BreederService {

  constructor() { }

  recombineGenes(g1: number, g2: number): number {
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

  breedGenes(parent1: number[], parent2: number[]): number[] {
    let child_genes = [];
    for (let i = 0; i < Math.min(parent1.length, parent2.length); i++) {
      let gene = this.recombineGenes(parent1[i], parent2[i]);
      child_genes.push(gene);
    }
    return child_genes;
  }

  breedFlowers(parent1: Flower, parent2: Flower): Flower {
    if (parent1.species.id !== parent2.species.id) {
      throw 'Parents of different species cannot breed';
    }
    let child_flower = {species: parent1.species, genes: this.breedGenes(parent1.genes, parent2.genes)};
    return child_flower;
  }

  /*simulateBreedingPair(parent1: Flower, parent2: Flower): {[x: Color]: number[][]} {

  }*/

  canHaveParent(childGenes: number[], parentGenes: number[]): boolean {
    if (parentGenes.length != childGenes.length) {
      return false;
    }
    for (let i = 0; i < parentGenes.length; i++) {
      let pGene = parentGenes[i];
      let cGene = childGenes[i];
      if (pGene == 0 && cGene == 2) {
        return false;
      }
      if (pGene == 2 && cGene == 0) {
        return false;
      }
    }
    return true;
  }

  canHaveOffspring(parent1Genes: number[], parent2Genes: number[], childGenes: number[]): boolean {
    if (parent1Genes.length != childGenes.length) {
      return false;
    }
    if (parent2Genes.length != childGenes.length) {
      return false;
    }
    for (let i = 0; i < childGenes.length; i++) {
      let p1Gene = parent1Genes[i];
      let p2Gene = parent2Genes[i];
      let cGene = childGenes[i];
      // return false for impossible combos

      // AA + AA != aa
      // AA + AA != Aa
      if (p1Gene == 2 && p2Gene == 2) {
        if (cGene == 0 || cGene == 1) {
          return false;
        }
      }

      // Aa + AA != aa
      if ((p1Gene == 1 && p2Gene == 2) || (p1Gene == 2 && p2Gene == 1)) {
        if (cGene == 0) {
          return false;
        }
      }

      // aa + AA != aa
      // aa + AA != AA
      if ((p1Gene == 0 && p2Gene == 2) || (p1Gene == 2 && p2Gene == 0)) {
        if (cGene == 0 || cGene == 2) {
          return false;
        }
      }

      // aa + Aa != AA
      if ((p1Gene == 0 && p2Gene == 1) || (p1Gene == 1 && p2Gene == 0)) {
        if (cGene == 2) {
          return false;
        }
      }

      // aa + aa != Aa
      // aa + aa != AA
      if (p1Gene == 0 && p2Gene == 0) {
        if (cGene == 1 || cGene == 2) {
          return false;
        }
      }
    }
    return true;
  }
}
