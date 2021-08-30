import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfinitySpinnerComponent } from './infinity-spinner.component';

describe('InfinitySpinnerComponent', () => {
  let component: InfinitySpinnerComponent;
  let fixture: ComponentFixture<InfinitySpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfinitySpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfinitySpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
