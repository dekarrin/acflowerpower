import { Pipe, PipeTransform } from '@angular/core';

import { SpeciesService } from './species.service';
import { SpeciesId } from './species';

@Pipe({name: 'geneSequenceShorthand'})
export class GeneSequenceShorthandPipe implements PipeTransform {

  constructor(private speciesService: SpeciesService) {}

  transform(value: number[] | string, speciesId: SpeciesId): string {
    let spec = this.speciesService.getSpecies(speciesId);
    if (!spec) {
      return "<invalid species id: " + String(speciesId) + ">"
    }
    let specGenes = spec.genes;

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

      if (v == 0) {
        result += "0"
      } else if (v == 1) {
        result += "1"
      } else if (v == 2) {
        result += "2"
      } else {
        result += "?";
      }
    }
    return result;

  }
}
