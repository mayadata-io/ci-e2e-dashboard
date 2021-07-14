import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PipelinesDashboardComponent } from './pipelines-dashboard.component';

describe('PipelinesDashboardComponent', () => {
  let component: PipelinesDashboardComponent;
  let fixture: ComponentFixture<PipelinesDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelinesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
