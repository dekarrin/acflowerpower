import { Injectable } from '@angular/core';

import { Color } from './color';

import { PHENOTYPE_DEFINITIONS } from './data/phenotypes';
import { SpeciesId } from './species';

import { getColorByGenes } from './lib/breeding';

@Injectable({
  providedIn: 'root'
})
export class PhenotypeService {

  private _indexedByColor: {[key in SpeciesId]: {[K in Color]?: [number[]]}};

  constructor() { }

  getColorByGenes(speciesId: SpeciesId, genes: number[]): Color {
    return getColorByGenes(speciesId, genes);
  }

  speciesHasColor(speciesId: SpeciesId, color: Color) {
    if (!this._indexedByColor) {
      this.getAllIndexedByColor();
    }
    return color in this._indexedByColor[speciesId];
  }

  getAllIndexedByGene(): {[key in SpeciesId]: any} {
    return PHENOTYPE_DEFINITIONS;
  }

  getAllIndexedByColor(): {[key in SpeciesId]: {[K in Color]?: [number[]]}} {
    if (this._indexedByColor) {
      return this._indexedByColor;
    }
    let bySpecies: {[key in SpeciesId]: {[K in Color]?: [number[]]}} = {
      [SpeciesId.Rose]: {},
      [SpeciesId.Cosmo]: {},
      [SpeciesId.Lily]: {},
      [SpeciesId.Pansy]: {},
      [SpeciesId.Hyacinth]: {},
      [SpeciesId.Tulip]: {},
      [SpeciesId.Mum]: {},
      [SpeciesId.Windflower]: {}
    };
    let phenotypeDefinitions = this.getAllIndexedByGene();
    for (let item in phenotypeDefinitions) {
      let specId: SpeciesId = parseInt(item) as SpeciesId;
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
    this._indexedByColor = bySpecies;
    return bySpecies;
  }

  getPossibleColors(speciesId: SpeciesId): Color[] {
    if (!this._indexedByColor) {
      this.getAllIndexedByColor();
    }
    if (!(speciesId in this._indexedByColor)) {
      return [];
    }
    let genesByColor = this._indexedByColor[speciesId];
    return Object.keys(genesByColor) as Color[];
  }
}
