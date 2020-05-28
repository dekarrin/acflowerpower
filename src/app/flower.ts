import { Species } from './species';
import { SPECIES_DEFINITIONS } from './data/species';
import { Color } from './color';
import { PHENOTYPE_DEFINITIONS } from './data/phenotypes';

export interface Flower {
  genes: number[];
  species: Species;
}

export function getFlowerColor(f: Flower): Color {
  return getFlowerColorByGenes(f.species.id, f.genes);
}

export function getFlowerColorByGenes(speciesId: number, genes: number[]): Color {
  // WARNING: we are losing compile-time type-safety here.
  let color: any = PHENOTYPE_DEFINITIONS[speciesId];
  for (let i = 0; i < genes.length; i++) {
    color = color[genes[i]];
  }
  return color;
}

export function getDefaultFlower(): Flower {
  let f = {species: SPECIES_DEFINITIONS[0], genes: [0, 0, 0, 0]};
  return f;
}
