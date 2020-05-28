import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { Species } from '../species';
import { SpeciesService } from '../species.service';
import { Flower, getFlowerColor, getFlowerColorByGenes, getDefaultFlower } from '../flower';
import { Color, ALL_COLORS } from '../color';
import { LogService } from '../log.service';
import { PhenotypeService } from '../phenotype.service';
import { BreedService } from '../breed.service';

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.css']
})
export class PhenotypesComponent implements OnInit, DoCheck {

  allFlowerSpecies: Species[];
  allColors: Color[];

  flower: Flower;
  searchSpecies: Species;
  searchColor: Color;

  phenotypesBySpecies;

  parent1Opened: boolean;
  parent2Opened: boolean;

  searchParent1Genes: number[];
  searchParent2Genes: number[];

  constructor(private speciesService: SpeciesService, private logService: LogService, private cdr: ChangeDetectorRef, private phenotypeService: PhenotypeService, private breederService: BreedService) { }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getSpecies();
    this.getPhenotypes();
    this.parent1Opened = false;
    this.parent2Opened = false;
    this.allColors = ALL_COLORS;
    this.searchSpecies = this.allFlowerSpecies[0];
    this.searchColor = 'white';
    this.flower = getDefaultFlower();
    this.searchParent1Genes = getDefaultFlower().genes;
    this.searchParent2Genes = getDefaultFlower().genes;
  }

  colorIsAvailable(color: Color): boolean {
    return color in this.phenotypesBySpecies[this.searchSpecies.id];
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

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getPhenotypes(): void {
    this.phenotypesBySpecies = this.phenotypeService.getAllIndexedByColor();
  }

  getSearchParent1Color(): Color {
    return getFlowerColorByGenes(this.searchSpecies.id, this.searchParent1Genes);
  }

  getSearchParent2Color(): Color {
    return getFlowerColorByGenes(this.searchSpecies.id, this.searchParent2Genes);
  }

  getColor(): Color {
    return getFlowerColor(this.flower);
  }

  getColorClass(): string {
    return this.getColor() + "-flower flower-title";
  }

}
