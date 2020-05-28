import { Injectable } from '@angular/core';

import { Species } from './species';
import { Color } from './color';

import { PHENOTYPE_DEFINITIONS } from './data/phenotypes';

@Injectable({
  providedIn: 'root'
})
export class PhenotypeService {

  constructor() { }

  getAllIndexedByGene(): {[key: number]: any} {
    return PHENOTYPE_DEFINITIONS;
  }

  getAllIndexedByColor(): {[key: number]: {[K in Color]: [number[]]}} {
    let bySpecies = {};
    let phenotypeDefinitions = this.getAllIndexedByGene();
    for (let specId in phenotypeDefinitions) {
      let phenotypesTable = phenotypeDefinitions[specId];
      let c: Color;
      let seq: number[];
      let colorsTable = {};
      let fourthGeneExists = typeof phenotypesTable[0][0][0] !== 'string';
      for (let g1 = 0; g1 < phenotypesTable.length; g1++) {
        for (let g2 = 0; g2 < phenotypesTable[g1].length; g2++) {
          for (let g3 = 0; g3 < phenotypesTable[g1][g2].length; g3++) {
            if (fourthGeneExists) {
              for (let g4 = 0; g4 < phenotypesTable[g1][g2][g3].length; g4++) {
                c = phenotypesTable[g1][g2][g3][g4];
                if (!(c in colorsTable)) {
                  colorsTable[c] = [];
                }
                colorsTable[c].push([g1, g2, g3, g4]);
              }
            } else {
              c = phenotypesTable[g1][g2][g3];
              if (!(c in colorsTable)) {
                colorsTable[c] = [];
              }
              colorsTable[c].push([g1, g2, g3]);
            }
          }
        }
      }
      bySpecies[specId] = colorsTable;
    }
    return bySpecies;
  }


}
