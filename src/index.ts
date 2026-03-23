import { App } from '@slack/bolt';
import { meetingAssistant } from './mastra/agents';

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN, // The xapp- token we generated
  socketMode: true,
});

// Listen for mentions
slackApp.event('app_mention', async ({ event, say }) => {
  // 1. Send the user's message to your Mastra agent
  const response = await meetingAssistant.generate(event.text);
  
  // 2. Reply back to the Slack thread
  await say({
    text: response.text,
    thread_ts: event.ts
  });
});

(async () => {
  await slackApp.start();
  console.log('🤖 Mastra Agent is live on Slack via Socket Mode!');
})();