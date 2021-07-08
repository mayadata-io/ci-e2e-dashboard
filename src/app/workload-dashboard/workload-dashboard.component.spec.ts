import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkloadDashboardComponent } from './workload-dashboard.component';

describe('WorkloadDashboardComponent', () => {
  let component: WorkloadDashboardComponent;
  let fixture: ComponentFixture<WorkloadDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkloadDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkloadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
