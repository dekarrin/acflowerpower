import { Injectable } from '@angular/core';

import { Species, SpeciesId } from './species';

import { SPECIES_DEFINITIONS } from './data/species';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor() { }

  getSpecies(id: SpeciesId): Species {
    for (let s of SPECIES_DEFINITIONS) {
      if (s.id === id) {
        return s;
      }
    }
    return null;
  }

  getSpeciesByName(name: string): Species {
    for (let s of SPECIES_DEFINITIONS) {
      if (s.name.toLowerCase() == name.toLowerCase()) {
        return s;
      }
    }
    return null;
  }

  getAllSpecies(): Species[] {
    return SPECIES_DEFINITIONS;
  }
}
