import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeSearchComponent } from './phenotype-search.component';

describe('PhenotypeSearchComponent', () => {
  let component: PhenotypeSearchComponent;
  let fixture: ComponentFixture<PhenotypeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
