import { summarize } from '../claude';

jest.mock('@anthropic-ai/sdk', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          ai_summary: 'The FMCSA proposed new ELD rules affecting all drivers.',
          why_it_matters: 'drivers may need to update their ELD devices by Q1 2027.',
        }),
      },
    ],
  });
  const MockAnthropic = jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  }));
  return { __esModule: true, default: MockAnthropic };
});

describe('summarize', () => {
  it('returns aiSummary and whyItMatters from Claude response', async () => {
    const result = await summarize('FMCSA ELD Rule', 'New rules announced for ELD devices.');
    expect(result.aiSummary).toContain('FMCSA');
    expect(result.whyItMatters).toContain('drivers');
  });
});
