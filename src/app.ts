import * as bolt from '@slack/bolt';
import * as fs from 'fs';
import { deleteMessage } from './delete-message';
import { toggleReadOnly } from './toggle-read-only';

const PORT = process.env.PORT || 3000;

const channels = readChannels();

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message(deleteMessage(channels));

app.command('/readonly', toggleReadOnly(channels, handleWriteChannels));

(async () => {
  await app.start(PORT);

  console.log('Bot started on port', PORT);
})();

function readChannels(): string[] {
  const channelJSON = fs.readFileSync('./config/channels.json');
  return JSON.parse(channelJSON.toString());
}

function handleWriteChannels(channels: string[]) {
  fs.writeFileSync('./config/channels.json', JSON.stringify(channels));
}
