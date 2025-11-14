import { DailySummaryService } from '../daily-summary.service';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('DailySummaryService', () => {
  let service: DailySummaryService;

  beforeEach(() => {
    service = new DailySummaryService();
    jest.clearAllMocks();
  });

  it('should generate daily summary', async () => {
    const mockEvents = [{ id: 1, title: 'Meeting', start_time: new Date() }];
    const mockTasks = [{ id: 1, title: 'Task', priority: 'high' }];

    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: mockEvents })
      .mockResolvedValueOnce({ rows: mockTasks })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.generateDailySummary(1, new Date());

    expect(result).toContain('1 compromissos');
    expect(result).toContain('1 tarefas');
  });

  it('should detect conflicts', async () => {
    const mockEvents = [
      { id: 1, start_time: new Date('2024-01-01 10:00'), end_time: new Date('2024-01-01 11:00') },
      { id: 2, start_time: new Date('2024-01-01 10:30'), end_time: new Date('2024-01-01 11:30') },
    ];

    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: mockEvents })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.generateDailySummary(1, new Date());

    expect(result).toContain('conflito');
  });
});
