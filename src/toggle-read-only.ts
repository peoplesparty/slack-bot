import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';

export const toggleReadOnly: (
  channels: string[]
) => Middleware<SlackCommandMiddlewareArgs> = (channels: string[]) => async ({
  payload,
  ack,
  client,
}) => {
  await ack();

  let text: string;
  if (Object.values(channels).includes(payload.channel_id)) {
    channels.splice(channels.indexOf(payload.channel_id));
    text = 'Channel is no longer read only';
  } else {
    channels.push(payload.channel_id);
    text = 'Channel is now read only';
  }

  await client.chat.postEphemeral({
    token: process.env.SLACK_BOT_TOKEN,
    channel: payload.channel_id,
    user: payload.user_id,
    text,
  });
};
