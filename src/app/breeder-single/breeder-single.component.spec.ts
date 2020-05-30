import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSingleComponent } from './breeder-single.component';

describe('BreederSingleComponent', () => {
  let component: BreederSingleComponent;
  let fixture: ComponentFixture<BreederSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreederSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreederSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
