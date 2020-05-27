import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Species } from '../species';

import { SpeciesService } from '../species.service';

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.css']
})
export class PhenotypesComponent implements OnInit {

  allFlowerSpecies: Species[];

  selectedSpecies: Species;

  genotype: number[];

  constructor(private speciesService: SpeciesService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getSpecies();
    this.selectedSpecies = this.allFlowerSpecies[0];
    this.genotype = [0, 1, 1]
  }

  newEntered(): void {
    
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  alter(): void {
    this.genotype = [1, 1, 1];
  }
}
