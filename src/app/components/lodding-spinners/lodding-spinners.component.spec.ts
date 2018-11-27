import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoddingSpinnersComponent } from './lodding-spinners.component';

describe('LoddingSpinnersComponent', () => {
  let component: LoddingSpinnersComponent;
  let fixture: ComponentFixture<LoddingSpinnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoddingSpinnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoddingSpinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
