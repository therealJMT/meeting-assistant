import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { registerApiRoute } from "@mastra/core/server";
import { meetingAssistant } from "./agents/meeting-assistant";
import { bot } from "../chat";

export const mastra = new Mastra({
  agents: { meetingAssistant },
  storage: new LibSQLStore({
    id: "mastra-storage",
    // stores observability, scores, ... into persistent file storage
    url: "file:./mastra.db",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    apiRoutes: [
      registerApiRoute("/webhooks/slack", {
        method: "POST",
        handler: async (c) => bot.webhooks.slack(c.req.raw),
      }),
    ],
  },
});