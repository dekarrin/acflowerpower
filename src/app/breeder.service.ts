import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Flower } from './flower';
import { FlowerService } from './flower.service';
import { Color } from './color';

import { breedFlowers } from './lib/breeding';

@Injectable({
  providedIn: 'root'
})
export class BreederService {

  constructor(
    private flowerService: FlowerService
  ) { }

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
