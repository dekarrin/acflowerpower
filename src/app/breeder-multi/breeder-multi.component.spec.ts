import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederMultiComponent } from './breeder-multi.component';

describe('BreederMultiComponent', () => {
  let component: BreederMultiComponent;
  let fixture: ComponentFixture<BreederMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreederMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreederMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
