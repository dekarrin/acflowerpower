import { Species } from './species';
import { SPECIES_DEFINITIONS } from './data/species';
import { Color } from './color';
import { PHENOTYPE_DEFINITIONS } from './data/phenotypes';

export interface Flower {
  genes: number[];
  species: Species;
}

export function getFlowerColor(f: Flower): Color {
  let specId = f.species.id;
  // WARNING: we are losing compile-time type-safety here.
  let color: any = PHENOTYPE_DEFINITIONS[specId];
  for (let i = 0; i < f.genes.length; i++) {
    color = color[f.genes[i]];
  }
  return color;
}

export function getDefaultFlower(): Flower {
  let f = {species: SPECIES_DEFINITIONS[0], genes: [0, 0, 0, 0]};
  return f;
}
