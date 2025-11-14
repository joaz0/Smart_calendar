import { BurnoutDetectorService } from '../burnout-detector.service';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('BurnoutDetectorService', () => {
  let service: BurnoutDetectorService;

  beforeEach(() => {
    service = new BurnoutDetectorService();
    jest.clearAllMocks();
  });

  it('should analyze burnout risk', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ hours: 50 }] })
      .mockResolvedValueOnce({ rows: [{ count: 25 }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.analyzeBurnoutRisk(1);

    expect(result.riskScore).toBeGreaterThan(0);
    expect(result.level).toBeDefined();
    expect(result.factors).toBeInstanceOf(Array);
  });

  it('should return high risk for overwork', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ hours: 60 }] })
      .mockResolvedValueOnce({ rows: [{ count: 30 }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.analyzeBurnoutRisk(1);

    expect(result.level).toBe('high');
  });
});
