import { Species } from './species'
import { Color } from './color';
import { PHENOTYPES } from './data/phenotypes';

export interface Flower {
  genes: number[];
  species: Species;
}

export function getFlowerColor(f: Flower): Color {
  let specId = f.species.id;
  let color = PHENOTYPES[specId];
  for (let i = 0; i < f.genes.length; i++) {
    color = color[f.genes[i]];
  }
  return color;
}
