import { Injectable } from '@angular/core';

import { Species } from './species';

const SPECIES_DEFINITIONS: Species[] = [
  {id: 0, name: "rose", namePlural: "roses", genes: ["r", "y", "w", "s"]},
  {id: 1, name: "cosmo", namePlural: "cosmos", genes: ["r", "y", "s"]},
  {id: 2, name: "lily", namePlural: "lilies", genes: ["r", "y", "s"]},
  {id: 3, name: "pansy", namePlural: "pansies", genes: ["r", "y", "w"]},
  {id: 4, name: "hyacinth", namePlural: "hyacinths", genes: ["r", "y", "w"]},
  {id: 5, name: "tulip", namePlural: "tuplips", genes: ["r", "y", "s"]},
  {id: 6, name: "mum", namePlural: "mums", genes: ["r", "y", "w"]},
  {id: 7, name: "windflower", namePlural: "windflowers", genes: ["r", "o", "w"]}
];

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor() { }

  getSpecies(id: number): Species {
    for (let s of SPECIES_DEFINITIONS) {
      if (s.id == id) {
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
