import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';

import { Species } from '../species';

import { SpeciesService } from '../species.service';
import { Flower, getFlowerColor } from '../flower';

import { Color } from '../color';

import { LogService } from '../log.service';

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.css']
})
export class PhenotypesComponent implements OnInit, DoCheck {

  allFlowerSpecies: Species[];

  flower: Flower

  constructor(private speciesService: SpeciesService, private logService: LogService, private cdr: ChangeDetectorRef) { }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getSpecies();
    this.flower = {species: this.allFlowerSpecies[0], genes: [0, 1, 1]};
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getColor(): Color {
    return getFlowerColor(this.flower);
  }

  getColorClass(): string {
    return this.getColor() + "-flower flower-title";
  }

}
