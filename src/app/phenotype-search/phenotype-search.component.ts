import { Component, OnInit } from '@angular/core';
import { SpeciesService } from '../species.service';
import { Species } from '../species';
import { FlowerService } from '../flower.service';
import { PhenotypeService } from '../phenotype.service';
import { BreederService } from '../breeder.service';
import { Color, ALL_COLORS } from '../color';

@Component({
  selector: 'app-phenotype-search',
  templateUrl: './phenotype-search.component.html',
  styleUrls: ['./phenotype-search.component.css']
})
export class PhenotypeSearchComponent implements OnInit {

  allFlowerSpecies: Species[];
  phenotypesBySpecies;
  allColors: Color[];
  searchSpecies: Species;
  searchColor: Color;

  parent1Opened: boolean;
  parent2Opened: boolean;

  searchParent1Genes: number[];
  searchParent2Genes: number[];

  constructor(
    private speciesService: SpeciesService,
    private phenotypeService: PhenotypeService,
    private breederService: BreederService,
    private flowerService: FlowerService
  ) { }

  ngOnInit(): void {
    this.getSpecies();
    this.getPhenotypes();
    this.parent1Opened = false;
    this.parent2Opened = false;
    this.allColors = ALL_COLORS;
    this.searchSpecies = this.flowerService.getDefaultFlower().species;
    this.searchColor = 'white';
    this.searchParent1Genes = this.flowerService.getDefaultFlower().genes;
    this.searchParent2Genes = this.flowerService.getDefaultFlower().genes;
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getPhenotypes(): void {
    this.phenotypesBySpecies = this.phenotypeService.getAllIndexedByColor();
  }

  colorIsAvailable(color: Color): boolean {
    return this.phenotypeService.speciesHasColor(this.searchSpecies.id, color);
  }

  getSearchParent1Color(): Color {
    return this.phenotypeService.getColorByGenes(this.searchSpecies.id, this.searchParent1Genes);
  }

  getSearchParent2Color(): Color {
    return this.phenotypeService.getColorByGenes(this.searchSpecies.id, this.searchParent2Genes);
  }

  currentSearch(): number[][] {
    let search = this.phenotypesBySpecies[this.searchSpecies.id][this.searchColor];
    if (this.parent1Opened && !this.parent2Opened) {
      search = search.filter(x => this.breederService.canHaveParent(x, this.searchParent1Genes));
    } else if (this.parent2Opened && !this.parent1Opened) {
      search = search.filter(x => this.breederService.canHaveParent(x, this.searchParent2Genes));
    } else if (this.parent1Opened && this.parent2Opened) {
      search = search.filter(x => this.breederService.canHaveOffspring(this.searchParent1Genes, this.searchParent2Genes, x));
    }
    return search;
  }

}
