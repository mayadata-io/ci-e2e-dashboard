import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PipelineTableComponent } from './pipeline-table.component';

describe('PipelineTableComponent', () => {
  let component: PipelineTableComponent;
  let fixture: ComponentFixture<PipelineTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
