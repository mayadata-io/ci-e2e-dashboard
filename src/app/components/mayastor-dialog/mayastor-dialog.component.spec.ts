import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayastorDialogComponent } from './mayastor-dialog.component';

describe('MayastorDialogComponent', () => {
  let component: MayastorDialogComponent;
  let fixture: ComponentFixture<MayastorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayastorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MayastorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
