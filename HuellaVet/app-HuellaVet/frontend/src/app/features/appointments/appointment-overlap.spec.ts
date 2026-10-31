import { Appointment } from '../../core/models/appointment.model';
import { findOverlap } from './appointment-overlap';

const CITA: Appointment = {
  id: 1,
  pet_id: 1,
  veterinarian_id: 1,
  start_date: '2030-01-15T14:00:00.000Z',
  end_date: '2030-01-15T15:00:00.000Z',
  reason: 'Control',
  state: 'scheduled',
};

const slot = (veterinarian_id: number, start: string, end: string) => ({
  veterinarian_id,
  start_date: start,
  end_date: end,
});

describe('findOverlap', () => {
  it('should find a partial overlap for the same veterinarian', () => {
    const resultado = findOverlap(
      slot(1, '2030-01-15T14:30:00.000Z', '2030-01-15T15:30:00.000Z'),
      [CITA],
    );

    expect(resultado?.id).toBe(1);
  });

  it('should not treat back-to-back appointments as an overlap', () => {
    const resultado = findOverlap(
      slot(1, '2030-01-15T15:00:00.000Z', '2030-01-15T16:00:00.000Z'),
      [CITA],
    );

    expect(resultado).toBeNull();
  });

  it('should ignore appointments of other veterinarians', () => {
    const resultado = findOverlap(
      slot(2, '2030-01-15T14:00:00.000Z', '2030-01-15T15:00:00.000Z'),
      [CITA],
    );

    expect(resultado).toBeNull();
  });

  it('should ignore cancelled appointments', () => {
    const resultado = findOverlap(
      slot(1, '2030-01-15T14:00:00.000Z', '2030-01-15T15:00:00.000Z'),
      [{ ...CITA, state: 'cancelled' }],
    );

    expect(resultado).toBeNull();
  });

  it('should ignore the appointment that is being edited', () => {
    const resultado = findOverlap(
      slot(1, '2030-01-15T14:00:00.000Z', '2030-01-15T15:00:00.000Z'),
      [CITA],
      1,
    );

    expect(resultado).toBeNull();
  });
});
