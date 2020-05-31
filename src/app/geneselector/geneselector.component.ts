import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GENE_ORDER, speciesHasGene, Species, getGeneDict } from '../species';
import { LogService } from '../log.service';

/*
NOTE: the changes made in this controlvalueaccessor make angular very antsy.
parent component must be notified of changes in its ngDoChanges() function or
it may result in unclean state.
*/

@Component({
  selector: 'app-geneselector',
  templateUrl: './geneselector.component.html',
  styleUrls: ['./geneselector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneselectorComponent),
      multi: true
    }
  ]
})
export class GeneselectorComponent implements OnInit, ControlValueAccessor {
  private _species: Species;
  @Input()
  set species(species: Species) {
    this._species = species;
    this.setSequenceFromSelector();
  }
  get species(): Species { return this._species; }

  onChange: any = () => {};
  onTouched: any = () => {};

  private _value: number[];
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  geneSequence: string;
  selectedGenes: {[x: string]: number} = getGeneDict();
  geneLabels: string[];

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.geneLabels = GENE_ORDER;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      let newValue: number[] = [];
      for (let i = 0; i < 4 && i < value.length; i++) {
        newValue.push(value[i]);
      }
      while (newValue.length < 3) {
        newValue.push(0);
      }
      if (this.species) {
        while (newValue.length < this.species.genes.length) {
          newValue.push(0);
        }
      }
      this.value = newValue;
      if (this.species) {
        let seq = "";
        for (let i = 0; i < this.species.genes.length; i++) {
          let g = this.species.genes[i];
          this.selectedGenes[g] = this.value[i];
          seq += String(this.value[i]);
        }
        this.geneSequence = seq;
      }
    }
  }


  hasGene(g: string): boolean {
    return speciesHasGene(this.species, g);
  }

  geneSequenceIsValid(): boolean {
    if (this.geneSequence.length > this.species.genes.length) {
      return false;
    }
    const pattern: RegExp = /^[012]*$/;
    return pattern.test(this.geneSequence);
  }

  setSequenceFromSelector(): void {
    let seq = "";
    let new_val = [];
    for (let i = 0; i < this.species.genes.length; i++) {
      let g = this.species.genes[i];
      new_val.push(this.selectedGenes[g]);
      seq += String(this.selectedGenes[g]);
    }
    this.geneSequence = seq;
    this.value = new_val
  }

  setSelectorFromSequence(): void {
    if (!this.geneSequenceIsValid()) {
      return;
    }
    for (let i = 0; i < this.geneSequence.length; i++) {
      let geneName = this.species.genes[i];
      this.selectedGenes[geneName] = parseInt(this.geneSequence[i]);
    }
    // separately update the new value from the selected genes
    let new_val = [];
    for (let i = 0; i < this.species.genes.length; i++) {
      let g = this.species.genes[i];
      new_val.push(this.selectedGenes[g]);
    }
    this.value = new_val;
  }

}
