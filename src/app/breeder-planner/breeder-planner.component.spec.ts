import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederPlannerComponent } from './breeder-planner.component';

describe('BreederPlannerComponent', () => {
  let component: BreederPlannerComponent;
  let fixture: ComponentFixture<BreederPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreederPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreederPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
