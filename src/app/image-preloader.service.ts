import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SpeciesService } from './species.service';
import { PhenotypeService } from './phenotype.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloaderService {

  static readonly IMAGE_ROOT: string = 'assets/images';

  constructor(private speciesService: SpeciesService, private phenotypeService: PhenotypeService, private logger: LogService) { }

  preload(paths: string[]): Observable<HTMLImageElement> {
    return Observable.create(function (observer) {
      for (let i = 0; i < paths.length; i++) {
        let preloaded = new Image();
        preloaded.src = paths[i];
        observer.next(preloaded);
      }
      observer.complete();
    });
  }

  preloadFlowers(): Observable<HTMLImageElement> {
    let species = this.speciesService.getAllSpecies();
    let paths = [];
    // get all valid breeding species phenotypes and preload them
    for (let i = 0; i < species.length; i++) {
      let speciesPath = ImagePreloaderService.IMAGE_ROOT + '/' + species[i].namePlural + '/' + species[i].name + '-';
      let colors = this.phenotypeService.getPossibleColors(species[i].id);
      for (let j = 0; j < colors.length; j++) {
        let fullPath = speciesPath + colors[j] + '.png';
        paths.push(fullPath);
      }
    }
    // also add gold rose because it will not be added above due to not being a valid breeding color.
    paths.push(ImagePreloaderService.IMAGE_ROOT + '/roses/rose-gold.png')
    return this.preload(paths);
  }

  preloadFlowersAsync(nextCallback, completeCallback): number {
    let species = this.speciesService.getAllSpecies();
    let paths = [];
    // get all valid breeding species phenotypes and preload them
    for (let i = 0; i < species.length; i++) {
      let speciesPath = ImagePreloaderService.IMAGE_ROOT + '/' + species[i].namePlural + '/' + species[i].name + '-';
      let colors = this.phenotypeService.getPossibleColors(species[i].id);
      for (let j = 0; j < colors.length; j++) {
        let fullPath = speciesPath + colors[j] + '.png';
        paths.push(fullPath);
      }
    }
    // also add gold rose because it will not be added above due to not being a valid breeding color.
    paths.push(ImagePreloaderService.IMAGE_ROOT + '/roses/rose-gold.png')
    return this.preloadAsync(paths, nextCallback, completeCallback);
  }

  // for older browsers that dont support workers; load 1 image then
  preloadAsync(paths: string[], nextCallback, completeCallback): number {
    let i = 0;
    let timer = setInterval(function() {
      let preloaded = new Image();
      preloaded.src = paths[i];
      nextCallback(preloaded);
      i++;
      if (i >= paths.length) {
        clearInterval(timer);
        completeCallback();
      }
    }, 10);
    return timer;
  }
}
