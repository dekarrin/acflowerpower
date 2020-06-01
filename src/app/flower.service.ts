import { Injectable } from '@angular/core';

import { Color } from './color';
import { Flower } from './flower';
import { SpeciesId } from './species';
import { SpeciesService } from './species.service';
import { PhenotypeService } from './phenotype.service';

import { SEED_DATA } from './data/seeds'

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

  getSeedFlowers(id: SpeciesId): Flower[] {
    let gene_data = SEED_DATA[id];
    return gene_data.map(x => {return {species: this.speciesService.getSpecies(id), genes: x}});
  }
}
