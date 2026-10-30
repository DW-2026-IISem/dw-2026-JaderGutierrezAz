import { Injectable } from '@angular/core';
import {
  Appointment,
  AppointmentCreate,
  AppointmentPatch,
  AppointmentUpdate,
} from '../../core/models/appointment.model';
import { CrudApi } from '../../core/services/crud-api';

/**
 * /api/citas — la lista llega en `appointments`.
 * El PATCH acepta `state` (completar una cita), por eso su cuerpo es `AppointmentPatch`.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentApi extends CrudApi<
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  AppointmentPatch
> {
  constructor() {
    super('citas', 'appointments', 'appointment');
  }
}
