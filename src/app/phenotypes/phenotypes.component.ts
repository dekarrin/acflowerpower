import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.css']
})
export class PhenotypesComponent implements OnInit, DoCheck {

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }

}
