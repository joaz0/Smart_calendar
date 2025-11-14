import { HabitsService } from '../habits.service';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('HabitsService', () => {
  let service: HabitsService;

  beforeEach(() => {
    service = new HabitsService();
    jest.clearAllMocks();
  });

  it('should calculate consistency rate', async () => {
    const mockEntries = [
      { completed: true },
      { completed: true },
      { completed: false },
    ];

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockEntries });

    const result = await service.calculateConsistency(1, 'week');

    expect(result.completedDays).toBe(2);
    expect(result.totalDays).toBe(7);
  });

  it('should calculate current streak', async () => {
    const mockEntries = [
      { completed: true },
      { completed: true },
      { completed: false },
    ];

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockEntries });

    const result = await service.calculateConsistency(1, 'week');

    expect(result.currentStreak).toBe(2);
  });
});
