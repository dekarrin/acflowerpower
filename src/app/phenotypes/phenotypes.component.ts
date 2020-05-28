import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { Species } from '../species';
import { SpeciesService } from '../species.service';
import { Flower, getFlowerColor, getDefaultFlower } from '../flower';
import { Color, ALL_COLORS } from '../color';
import { LogService } from '../log.service';
import { PhenotypeService } from '../phenotype.service';

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

  constructor(private speciesService: SpeciesService, private logService: LogService, private cdr: ChangeDetectorRef, private phenotypeService: PhenotypeService) { }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getSpecies();
    this.getPhenotypes();
    this.allColors = ALL_COLORS;
    this.searchSpecies = this.allFlowerSpecies[0];
    this.searchColor = 'white';
    this.flower = getDefaultFlower();
  }

  colorIsAvailable(color: Color): boolean {
    return color in this.phenotypesBySpecies[this.searchSpecies.id];
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getPhenotypes(): void {
    this.phenotypesBySpecies = this.phenotypeService.getAllIndexedByColor();
  }

  getColor(): Color {
    return getFlowerColor(this.flower);
  }

  getColorClass(): string {
    return this.getColor() + "-flower flower-title";
  }

}
