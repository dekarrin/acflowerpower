import { Component, OnInit } from '@angular/core';

import { Species } from '../species';
import { SpeciesService } from '../species.service';
import { BreederService } from '../breeder.service';

import { FlowerService } from '../flower.service';

@Component({
  selector: 'app-breeder-single',
  templateUrl: './breeder-single.component.html',
  styleUrls: ['./breeder-single.component.css']
})
export class BreederSingleComponent implements OnInit {

  allFlowerSpecies: Species[];
  species: Species;

  parent1Genes: number[];
  parent2Genes: number[];

  simulationComplete = false;

  constructor(
    private speciesService: SpeciesService,
    private breederService: BreederService,
    private flowerService: FlowerService
  ) { }

  ngOnInit(): void {
    this.getSpecies();
    this.species = this.flowerService.getDefaultFlower().species;
    this.parent1Genes = this.flowerService.getDefaultFlower().genes;
    this.parent2Genes = this.flowerService.getDefaultFlower().genes;
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

}
