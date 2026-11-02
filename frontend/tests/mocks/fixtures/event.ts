export interface MockEvent {
  id: string;
  title: string;
  day: number | string;
  weekday: string;
  dateString: string;
  taken: number;
  capacity: number;
  waitlisted?: number;
  status: 'open' | 'full' | 'closed';
  surface: 'shader' | 'plain';
  shaderTone?: 'default' | 'warm';
  closedReason?: string;
}

export function buildEvent(overrides: Partial<MockEvent> = {}): MockEvent {
  return {
    id: 'evt-data-viz-01',
    title: 'Data Viz Night',
    day: 13,
    weekday: 'FRI',
    dateString: 'Fri 13 Nov, 18:30',
    taken: 54,
    capacity: 60,
    status: 'open',
    surface: 'shader',
    shaderTone: 'default',
    ...overrides,
  };
}

export function buildHackathonEvent(overrides: Partial<MockEvent> = {}): MockEvent {
  return buildEvent({
    id: 'evt-hackathon-02',
    title: 'Weekend Hackathon',
    day: 15,
    weekday: 'SUN',
    dateString: 'Sun 15 Nov, 09:00',
    taken: 120,
    capacity: 120,
    waitlisted: 12,
    status: 'full',
    surface: 'shader',
    shaderTone: 'warm',
    ...overrides,
  });
}

export function buildClosedEvent(overrides: Partial<MockEvent> = {}): MockEvent {
  return buildEvent({
    id: 'evt-mixer-03',
    title: 'Commuter Society Mixer',
    day: 21,
    weekday: 'SAT',
    dateString: 'Sat 21 Nov, 17:00',
    taken: 30,
    capacity: 60,
    status: 'closed',
    closedReason: 'Cut-off passed',
    surface: 'plain',
    ...overrides,
  });
}
