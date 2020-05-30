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

  allColors: Color[];
  allFlowerSpecies: Species[];
  searchSpecies: Species;
  searchColor: Color;
  flower: Flower;

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
  }

}
