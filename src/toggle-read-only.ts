import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { isValidUserResponse } from './models/user-response';

export const toggleReadOnly: (
  channels: string[],
  writeChannels: (channels: string[]) => void
) => Middleware<SlackCommandMiddlewareArgs> = (
  channels,
  writeChannels
) => async ({ payload, ack, client, respond }) => {
  await ack();

  const userResponse = await client.users.info({
    user: payload.user_id,
  });

  const user = isValidUserResponse(userResponse) ? userResponse.user : null;

  let text: string;

  if (!user?.is_admin) {
    text = '⚠️ Only admins may use this command';
  } else if (Object.values(channels).includes(payload.channel_id)) {
    channels.splice(channels.indexOf(payload.channel_id));
    writeChannels(channels);
    text = 'Channel is no longer read only';
  } else {
    channels.push(payload.channel_id);
    writeChannels(channels);
    text = 'Channel is now read only';
  }

  await respond({
    response_type: 'ephemeral',
    text,
  });
};
