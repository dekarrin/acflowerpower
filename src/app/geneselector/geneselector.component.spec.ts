import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneselectorComponent } from './geneselector.component';

describe('GeneselectorComponent', () => {
  let component: GeneselectorComponent;
  let fixture: ComponentFixture<GeneselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
