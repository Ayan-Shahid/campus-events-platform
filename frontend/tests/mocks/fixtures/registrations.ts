export interface MockRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  registeredAt: string;
}

export function buildRegistration(overrides: Partial<MockRegistration> = {}): MockRegistration {
  return {
    id: 'reg-001',
    eventId: 'evt-data-viz-01',
    eventTitle: 'Data Viz Night',
    studentId: 'RMU-2026-00336',
    studentName: 'Ayan Shahid',
    studentEmail: 'ayan.shahid@university.edu',
    status: 'confirmed',
    registeredAt: '2026-11-01T10:36:00Z',
    ...overrides,
  };
}
