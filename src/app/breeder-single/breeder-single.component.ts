import { Component, OnInit } from '@angular/core';

import { Color } from '../color';
import { Species } from '../species';
import { SpeciesService } from '../species.service';
import { BreederService } from '../breeder.service';
import { SinglePairSimResult, Progress, simulateBreedingPairAsync, stringSequenceToGenes } from '../lib/breeding';

import { Flower } from '../flower';
import { FlowerService } from '../flower.service';

import { LogService } from '../log.service';

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

  results: SinglePairSimResult;
  finalResults;

  simulationStarted: boolean = false;
  simulationRunning: boolean = false;
  simulationPercentComplete: number = 0.0;
  simulationTrials: number;

  trials: number = 10000;

  private worker;
  private altWorkerTimer;

  constructor(
    private speciesService: SpeciesService,
    private breederService: BreederService,
    private flowerService: FlowerService,
    private logger: LogService
  ) { }

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      this.createNewWorker();
    } else {
      this.logger.log("ERROR: web workers are unsupported; will not be as performant");
    }
    this.getSpecies();
    this.species = this.flowerService.getDefaultFlower().species;
    this.parent1Genes = this.flowerService.getDefaultFlower().genes;
    this.parent2Genes = this.flowerService.getDefaultFlower().genes;
  }

  createNewWorker() {
    this.worker = new Worker('./breeder-single.worker', { type: 'module' });
    let owner = this;
    this.worker.onmessage = ({ data }) => {
      if (data.message === "next") {
        let messageData = data.data;
        owner.updateResults(messageData);
      } else if (data.message === "complete") {
        let messageData = data.data;
        owner.completeResults(messageData);
      }
    };
  }

  getSpecies(): void {
    this.allFlowerSpecies = this.speciesService.getAllSpecies();
  }

  getParent1Color(): Color {
    let f: Flower = {species: this.species, genes: this.parent1Genes};
    return this.flowerService.getFlowerColor(f);
  }

  getParent2Color(): Color {
    let f: Flower = {species: this.species, genes: this.parent2Genes};
    return this.flowerService.getFlowerColor(f);
  }

  getColor(sequence: string) {
    let genes = stringSequenceToGenes(sequence);
    let f = {species: this.species, genes: genes};
    return this.flowerService.getFlowerColor(f);
  }

  simulate(): void {
    if (this.worker) {
      if (this.simulationRunning) {
        this.worker.terminate();
        this.createNewWorker();
      }
    } else {
      if (this.altWorkerTimer) {
        clearInterval(this.altWorkerTimer);
        this.altWorkerTimer = null;
      }
    }
    this.simulationTrials = this.trials;
    this.simulationPercentComplete = 0.0;
    this.simulationStarted = true;
    this.simulationRunning = true;

    let flower1 = {species: this.species, genes: this.parent1Genes};
    let flower2 = {species: this.species, genes: this.parent2Genes};

    if (this.worker) {
      this.worker.postMessage({message: "start", data: {flower1: flower1, flower2: flower2, trials: this.simulationTrials}});
    } else {
      let owner = this;
      this.altWorkerTimer = simulateBreedingPairAsync(flower1, flower2, this.simulationTrials, x => owner.updateResults(x), x => owner.completeResults(x));
    }
  }

  updateResults(progress: Progress<SinglePairSimResult>): void {
    this.results = progress.results;
    this.simulationPercentComplete = 100 * (progress.trials / this.simulationTrials);
  }

  completeResults(progress: Progress<SinglePairSimResult>): void {
    this.results = progress.results;
    this.simulationPercentComplete = 100 * (progress.trials / this.simulationTrials);
    let trials = this.simulationTrials;
    this.simulationRunning = false;
    this.finalResults = [];
    for (let c in this.results) {
      let res = this.results[c];
      let totalCount = 0;
      let countedRes = {
        total: 0.0,
        subPercents: []
      }
      for (let r in res) {
        let count = res[r];
        totalCount += count;
        countedRes.subPercents.push([r, count / trials]);
      }
      countedRes.subPercents.sort((x, y) => y[1] - x[1]);
      countedRes.total = totalCount / trials;
      this.finalResults.push([c, countedRes]);
    }
    this.finalResults.sort((x, y) => y[1] - x[1] < 0.000000001 ? x[0].localCompare(y[0]) : y[1] - x[1]);
  }

}
