import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeSelectorComponent } from './phenotype-selector.component';

describe('PhenotypeSelectorComponent', () => {
  let component: PhenotypeSelectorComponent;
  let fixture: ComponentFixture<PhenotypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
