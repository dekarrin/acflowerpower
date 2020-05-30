import { Injectable } from '@angular/core';

import { Color } from './color';
import { Flower } from './flower';
import { SpeciesId } from './species';
import { SpeciesService } from './species.service';
import { PhenotypeService } from './phenotype.service';

@Injectable({
  providedIn: 'root'
})
export class FlowerService {

  constructor(private speciesService: SpeciesService, private phenotypeService: PhenotypeService) { }

  getDefaultFlower(): Flower {
    return {species: this.speciesService.getSpecies(SpeciesId.Rose), genes: [0, 0, 0, 0]};
  }

  getFlowerColor(f: Flower): Color {
    return this.phenotypeService.getColorByGenes(f.species.id, f.genes);
  }
}
