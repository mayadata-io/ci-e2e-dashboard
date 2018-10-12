import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadDashboardComponent } from './workload-dashboard.component';

describe('WorkloadDashboardComponent', () => {
  let component: WorkloadDashboardComponent;
  let fixture: ComponentFixture<WorkloadDashboardComponent>;

  beforeEach(async(() => {
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
