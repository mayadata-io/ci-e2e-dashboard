import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineTableComponent } from './pipeline-table.component';

describe('PipelineTableComponent', () => {
  let component: PipelineTableComponent;
  let fixture: ComponentFixture<PipelineTableComponent>;

  beforeEach(async(() => {
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
