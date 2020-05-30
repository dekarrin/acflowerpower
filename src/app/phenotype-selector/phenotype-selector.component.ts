import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { SpeciesService } from '../species.service';
import { Flower } from '../flower';
import { FlowerService } from '../flower.service';
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

  constructor(
    private cdr: ChangeDetectorRef,
    private speciesService: SpeciesService,
    private flowerService: FlowerService
  ) { }

  ngOnInit(): void {
    this.getSpecies();
    this.flower = this.flowerService.getDefaultFlower();
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getColor(): Color {
    return this.flowerService.getFlowerColor(this.flower);
  }

  getColorClass(): string {
    return this.getColor() + "-flower flower-title";
  }

}
