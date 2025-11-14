import { FocusModeService } from '../focus-mode.service';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('FocusModeService', () => {
  let service: FocusModeService;

  beforeEach(() => {
    service = new FocusModeService();
    jest.clearAllMocks();
  });

  it('should activate focus mode', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1 }] });

    const result = await service.activateFocusMode(1, 1, new Date());

    expect(result.blockedApps).toContain('slack');
    expect(result.blockedWebsites).toContain('youtube.com');
  });

  it('should deactivate focus mode', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await service.deactivateFocusMode(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE focus_sessions'),
      [1]
    );
  });
});
