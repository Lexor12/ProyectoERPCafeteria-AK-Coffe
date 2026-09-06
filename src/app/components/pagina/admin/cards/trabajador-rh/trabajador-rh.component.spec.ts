import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorRhComponent } from './trabajador-rh.component';

describe('TrabajadorRhComponent', () => {
  let component: TrabajadorRhComponent;
  let fixture: ComponentFixture<TrabajadorRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajadorRhComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrabajadorRhComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
