import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { SpeciesService } from '../species.service';
import { Flower, getFlowerColor, getDefaultFlower } from '../flower';
import { Species } from '../species';
import { Color } from '../color';

@Component({
  selector: 'app-phenotype-selector',
  templateUrl: './phenotype-selector.component.html',
  styleUrls: ['./phenotype-selector.component.css']
})
export class PhenotypeSelectorComponent implements OnInit {

  allFlowerSpecies: Species[];
  flower: Flower;

  constructor(private cdr: ChangeDetectorRef, private speciesService: SpeciesService) { }

  ngOnInit(): void {
    this.getSpecies();
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
    this.flower = getDefaultFlower();
  }

  getColor(): Color {
    return getFlowerColor(this.flower);
  }

  getColorClass(): string {
    return this.getColor() + "-flower flower-title";
  }

}
