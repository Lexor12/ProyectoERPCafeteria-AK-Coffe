import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEditarTrabajadorRhComponent } from './agregar-editar-trabajador-rh.component/agregar-editar-trabajador-rh.component';

describe('AgregarEditarTrabajadorRhComponent', () => {
  let component: AgregarEditarTrabajadorRhComponent;
  let fixture: ComponentFixture<AgregarEditarTrabajadorRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarEditarTrabajadorRhComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEditarTrabajadorRhComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
