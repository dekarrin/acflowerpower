import { Injectable } from '@angular/core';

import { SPECIES_DEFINITIONS } from './data/species';

import { Flower } from './flower';

@Injectable({
  providedIn: 'root'
})
export class FlowerService {

  constructor() { }

  getDefaultFlower(): Flower {
    return {species: SPECIES_DEFINITIONS[0], genes: [0, 0, 0, 0]}
  }
}
