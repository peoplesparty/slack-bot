import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { isValidUserResponse } from './models/user-response';

export const deleteMessage: (
  channels: string[]
) => Middleware<SlackEventMiddlewareArgs<'message'>> = (channels) => async ({
  payload,
  event,
  client,
}) => {
  if (event.subtype || !channels.includes(event.channel)) {
    return;
  }

  const userResponse = await client.users.info({
    user: payload.user,
  });

  const user = isValidUserResponse(userResponse) ? userResponse.user : null;

  if (user?.is_admin || user?.is_bot) return;

  await client.chat.delete({
    token: process.env.SLACK_USER_TOKEN,
    channel: payload.channel,
    ts: payload.ts,
    as_user: true,
  });

  await client.chat.postEphemeral({
    token: process.env.SLACK_BOT_TOKEN,
    channel: payload.channel,
    user: payload.user,
    text: `⚠️ Hey <@${payload.user}>! This channel is read only`,
  });
};
