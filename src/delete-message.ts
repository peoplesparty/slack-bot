import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

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

  if (!user || user.is_admin || user.is_bot) return;

  await client.chat.delete({
    token: process.env.SLACK_USER_TOKEN,
    channel: payload.channel,
    ts: payload.ts,
    as_user: true,
  });

  const conv = await client.conversations.open({
    token: process.env.SLACK_BOT_TOKEN,
    users: payload.user,
  });

  if (isValidChannelResponse(conv)) {
    await client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: conv.channel.id,
      text: `Hey <@${payload.user}>! <#${payload.channel}> is read only so your message was removed`,
    });
  }
};

function isValidUserResponse(
  input: unknown
): input is { user: { id: string; is_admin: boolean; is_bot: boolean } } {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).user === 'object' &&
    typeof (input as any).user.id === 'string' &&
    typeof (input as any).user.is_admin === 'boolean' &&
    typeof (input as any).user.is_bot === 'boolean'
  );
}

function isValidChannelResponse(
  input: unknown
): input is { channel: { id: string } } {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).channel === 'object' &&
    typeof (input as any).channel.id === 'string'
  );
}
