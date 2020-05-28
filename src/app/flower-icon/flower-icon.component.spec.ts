import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerIconComponent } from './flower-icon.component';

describe('FlowerIconComponent', () => {
  let component: FlowerIconComponent;
  let fixture: ComponentFixture<FlowerIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
