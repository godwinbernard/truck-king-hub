import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type SummaryResult = {
  aiSummary: string;
  whyItMatters: string;
};

export async function summarize(
  title: string,
  rawExcerpt: string
): Promise<SummaryResult> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are writing for an audience of U.S. truck drivers, owner-operators, and small fleet owners.

Article title: ${title}
Article excerpt: ${rawExcerpt}

Respond with ONLY a JSON object in this exact format:
{
  "ai_summary": "2-3 sentences summarizing what happened in plain English, no jargon",
  "why_it_matters": "1 sentence explaining the practical impact for trucking operators"
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const parsed = JSON.parse(text);

  return {
    aiSummary: parsed.ai_summary ?? '',
    whyItMatters: parsed.why_it_matters ?? '',
  };
}
