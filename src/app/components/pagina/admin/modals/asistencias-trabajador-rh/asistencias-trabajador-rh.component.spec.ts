import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasTrabajadorRhComponent } from './asistencias-trabajador-rh.component/asistencias-trabajador-rh.component';

describe('AsistenciasTrabajadorRhComponent', () => {
  let component: AsistenciasTrabajadorRhComponent;
  let fixture: ComponentFixture<AsistenciasTrabajadorRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasTrabajadorRhComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciasTrabajadorRhComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
