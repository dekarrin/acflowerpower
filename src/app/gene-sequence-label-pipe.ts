import { Pipe, PipeTransform } from '@angular/core';

import { SPECIES_DEFINITIONS } from './data/species';

import { INVERT_LABELS } from './app-options';

@Pipe({name: 'geneSequenceLabel'})
export class GeneSequenceLabelPipe implements PipeTransform {

  transform(value: number[] | string, speciesId: number): string {
    let specOptions = SPECIES_DEFINITIONS.filter(s => s.id == speciesId);
    if (specOptions.length < 1) {
      return "<invalid species id: " + String(speciesId) + ">"
    }
    let specGenes = specOptions[0].genes;

    if (typeof value === 'string') {
      let parsed_val: number[] = [];
      for (let i = 0; i < value.length; i++) {
        let ch = value[i];
        if (ch == "0") {
          parsed_val.push(0);
        } else if (ch == "1") {
          parsed_val.push(1);
        } else if (ch == "2") {
          parsed_val.push(2);
        } else {
          return "<invalid gene sequence: " + value + ">";
        }
      }
      value = parsed_val;
    }

    while (value.length < specGenes.length) {
      value.push(0);
    }

    let result: string = "";
    for (let i = 0; i < specGenes.length; i++) {
      let v = value[i];
      let label = specGenes[i];
      if (INVERT_LABELS.indexOf(label.toLowerCase()) > -1) {
        if (v == 0) {
          v = 2;
        } else if (v == 2) {
          v = 0;
        }
      }

      if (v == 0) {
        result += label.toLowerCase() + label.toLowerCase();
      } else if (v == 1) {
        result += label.toUpperCase() + label.toLowerCase();
      } else if (v == 2) {
        result += label.toUpperCase() + label.toUpperCase();
      } else {
        result += "??";
      }
    }
    return result;

  }
}
