import { Pipe, PipeTransform } from '@angular/core';

const invertLabels = ['w'];

@Pipe({name: 'geneLabel'})
export class GeneLabelPipe implements PipeTransform {
  transform(value: number, label: string): string {
    if (invertLabels.indexOf(label.toLowerCase()) > -1) {
      if (value == 0) {
        value = 2;
      } else if (value == 2) {
        value = 0;
      }
    }

    if (value == 0) {
      return label.toLowerCase() + label.toLowerCase();
    } else if (value == 1) {
      return label.toUpperCase() + label.toLowerCase();
    } else if (value == 2) {
      return label.toUpperCase() + label.toUpperCase();
    } else {
      return "??";
    }
  }
}
