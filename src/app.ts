import * as bolt from '@slack/bolt';
import { deleteMessage } from './delete-message';
import { toggleReadOnly } from './toggle-read-only';

const channels: string[] = [];

const PORT = process.env.PORT || 3000;

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message(deleteMessage(channels));
app.command('/readonly', toggleReadOnly(channels));

(async () => {
  await app.start(PORT);

  console.log('Bot started on port', PORT);
})();
