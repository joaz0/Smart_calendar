import { SchedulingPollsService } from '../scheduling-polls.service';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('SchedulingPollsService', () => {
  let service: SchedulingPollsService;

  beforeEach(() => {
    service = new SchedulingPollsService();
    jest.clearAllMocks();
  });

  it('should create poll', async () => {
    const mockPoll = { id: 1, title: 'Test Poll' };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockPoll] });

    const result = await service.createPoll(1, 'Test Poll', [], 30);

    expect(result.id).toBe(1);
    expect(result.title).toBe('Test Poll');
  });

  it('should record vote', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1 }] });

    const result = await service.vote(1, 1, [1, 2]);

    expect(pool.query).toHaveBeenCalled();
  });

  it('should calculate results', async () => {
    const mockVotes = [
      { preferred_slots: JSON.stringify([1, 2]) },
      { preferred_slots: JSON.stringify([1, 3]) },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockVotes });

    const result = await service.getResults(1);

    expect(result[0].slotId).toBe(1);
    expect(result[0].votes).toBe(2);
  });
});
