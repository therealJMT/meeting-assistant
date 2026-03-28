import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export const exaSearchTool = createTool({
  id: 'exa-search',
  description: 'Search the web for current information, research people, companies, and topics. Use this when you need up-to-date information from the internet.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    type: z.enum(['fast', 'auto', 'deep', 'deep-reasoning']).optional().default('auto'),
    numResults: z.number().optional().default(10),
    category: z.enum(['people', 'company', 'news', 'research paper']).optional(),
    text: z.object({
      maxCharacters: z.number().optional(),
    }).optional(),
    highlights: z.object({
      maxCharacters: z.number().optional(),
    }).optional(),
    maxAgeHours: z.number().optional(),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string().optional(),
      publishedDate: z.string().optional(),
    })),
  }),
  execute: async (input) => {
    const { query, type, numResults, category, text, highlights, maxAgeHours } = input;

    const results = await exa.searchAndContents(query, {
      type: type || 'auto',
      numResults: numResults || 10,
      category,
      contents: text
        ? { text: { maxCharacters: text.maxCharacters || 20000 } }
        : { highlights: { maxCharacters: highlights?.maxCharacters || 4000 } },
      maxAgeHours,
    });

    return {
      results: results.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        snippet: r.highlights?.[0] || r.text?.substring(0, 500),
        publishedDate: r.publishedDate,
      })),
    };
  },
});