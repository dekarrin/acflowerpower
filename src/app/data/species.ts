import { Species, SpeciesId } from '../species';

export const SPECIES_DEFINITIONS: Species[] = [
  {id: SpeciesId.Rose, name: "rose", namePlural: "roses", genes: ["r", "y", "w", "s"]},
  {id: SpeciesId.Cosmo, name: "cosmo", namePlural: "cosmos", genes: ["r", "y", "s"]},
  {id: SpeciesId.Lily, name: "lily", namePlural: "lilies", genes: ["r", "y", "s"]},
  {id: SpeciesId.Pansy, name: "pansy", namePlural: "pansies", genes: ["r", "y", "w"]},
  {id: SpeciesId.Hyacinth, name: "hyacinth", namePlural: "hyacinths", genes: ["r", "y", "w"]},
  {id: SpeciesId.Tulip, name: "tulip", namePlural: "tulips", genes: ["r", "y", "s"]},
  {id: SpeciesId.Mum, name: "mum", namePlural: "mums", genes: ["r", "y", "w"]},
  {id: SpeciesId.Windflower, name: "windflower", namePlural: "windflowers", genes: ["r", "o", "w"]}
];
