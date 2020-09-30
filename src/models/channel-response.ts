type ChannelResponse = {
  channel: { id: string };
};

export function isValidChannelResponse(
  input: unknown
): input is ChannelResponse {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).channel === 'object' &&
    typeof (input as any).channel.id === 'string'
  );
}
