export interface Species {
  id: number;
  name: string;
  namePlural: string;
  genes: string[];
}

export const GENE_ORDER: string[] = ["r", "y", "o", "w", "s"]


export function getGeneDict(): {[x: string]: number} {
  let genes = {};
  for (let i = 0; i < GENE_ORDER.length; i++) {
    genes[GENE_ORDER[i]] = 0;
  }
  return genes;
}

export function speciesHasGene(spec: Species, gene: string): boolean {
  return spec.genes.indexOf(gene) > -1;
}
