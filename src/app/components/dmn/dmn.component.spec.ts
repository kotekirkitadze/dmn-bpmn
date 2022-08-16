import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnComponent } from './dmn.component';

describe('DmnComponent', () => {
  let component: DmnComponent;
  let fixture: ComponentFixture<DmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
