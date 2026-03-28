import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { searchWeb } from '../tools/research-tools';
import { LibSQLVector } from '@mastra/libsql';
import { fastembed } from '@mastra/fastembed';

export const meetingAssistant = new Agent({
  id: 'meeting-Assistant',
  name: 'meeting-Assistant',
  instructions: `
    You are a personal meeting assistant. Your job is to help your user prepare for
    meetings by researching the people they're meeting with and providing concise,
    actionable briefs.

    When given information about an upcoming meeting:
    - Research the person and their company using the exa-search tool
    - Summarize who they are, what they do, and why the meeting matters
    - Highlight any talking points or areas of mutual interest
    - Keep briefs concise and scannable — bullet points over paragraphs

    When chatting casually:
    - Be helpful, direct, and low-friction
    - Remember context from previous conversations
    - If you don't know something, say so — don't make things up
  `,
  model: 'google/gemini-3.1-flash-lite-preview',
  tools: { searchWeb },
  memory: new Memory({

    vector: new LibSQLVector({
      id: "memory-vector",
      url: "file:./mastra.db",
    }

    ),

    embedder: fastembed,

    options: {

      semanticRecall: {
        topK: 3,
        messageRange: 2,
      },

      workingMemory: { 
        enabled: true,
        template: `# User Profile
        - Name:
        - Role:
        - Company:

        # Preferences
        - Communication style:
        - Meeting pre preferences:
        - Topics of interest:
        `,
       },
      lastMessages: 20,
    },
  }),
});
