import { Species, SpeciesId } from './species';
import { SPECIES_DEFINITIONS } from './data/species';
import { Color } from './color';
import { PHENOTYPE_DEFINITIONS } from './data/phenotypes';

//export const WHITE_SEED_ROSE: Flower = {}

export interface Flower {
  genes: number[];
  species: Species;
}
