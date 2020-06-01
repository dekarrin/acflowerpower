import { SpeciesId } from '../species';

export const SEED_DATA: {[key in SpeciesId]: number[][]} = {
    [SpeciesId.Rose]: [
      [0, 0, 1, 0],
      [0, 2, 0, 0],
      [2, 0, 0, 1]
    ],
    [SpeciesId.Cosmo]: [
      [0, 0, 1],
      [0, 2, 1],
      [2, 0, 0]
    ],
    [SpeciesId.Lily]: [
      [0, 0, 2],
      [0, 2, 0],
      [2, 0, 1]
    ],
    [SpeciesId.Pansy]: [
      [0, 0, 1],
      [0, 2, 0],
      [2, 0, 0]
    ],
    [SpeciesId.Hyacinth]: [
      [0, 0, 1],
      [0, 2, 0],
      [2, 0, 1]
    ],
    [SpeciesId.Tulip]: [
      [0, 0, 1],
      [0, 2, 0],
      [2, 0, 1]
    ],
    [SpeciesId.Mum]: [
      [0, 0, 1],
      [0, 2, 0],
      [2, 0, 0]
    ],
    [SpeciesId.Windflower]: [
      [0, 0, 1],
      [0, 2, 0],
      [2, 0, 0]
    ]
}
