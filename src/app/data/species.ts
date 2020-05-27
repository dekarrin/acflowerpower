import { Species } from '../species';

export const SPECIES_ID_ROSE = 0;
export const SPECIES_ID_COSMO = 1;
export const SPECIES_ID_LILY = 2;
export const SPECIES_ID_PANSY = 3;
export const SPECIES_ID_HYACINTH = 4;
export const SPECIES_ID_TULIP = 5;
export const SPECIES_ID_MUM = 6;
export const SPECIES_ID_WINDFLOWER = 7;


export const SPECIES_DEFINITIONS: Species[] = [
  {id: SPECIES_ID_ROSE, name: "rose", namePlural: "roses", genes: ["r", "y", "w", "s"]},
  {id: SPECIES_ID_COSMO, name: "cosmo", namePlural: "cosmos", genes: ["r", "y", "s"]},
  {id: SPECIES_ID_LILY, name: "lily", namePlural: "lilies", genes: ["r", "y", "s"]},
  {id: SPECIES_ID_PANSY, name: "pansy", namePlural: "pansies", genes: ["r", "y", "w"]},
  {id: SPECIES_ID_HYACINTH, name: "hyacinth", namePlural: "hyacinths", genes: ["r", "y", "w"]},
  {id: SPECIES_ID_TULIP, name: "tulip", namePlural: "tuplips", genes: ["r", "y", "s"]},
  {id: SPECIES_ID_MUM, name: "mum", namePlural: "mums", genes: ["r", "y", "w"]},
  {id: SPECIES_ID_WINDFLOWER, name: "windflower", namePlural: "windflowers", genes: ["r", "o", "w"]}
];
