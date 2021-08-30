import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PipelineDetailComponent } from './pipeline-detail.component';

describe('PipelineDetailComponent', () => {
  let component: PipelineDetailComponent;
  let fixture: ComponentFixture<PipelineDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
