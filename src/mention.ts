import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { MentionPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';

export default async function mention(
  payload: MentionPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server, body } = payload;
  const { name } = body.note.user;
  const { text } = body.note;

  const embed = {
    title: MESSAGES.MENTION_TITLE,
    color: DISCORD_COLORS.MENTION,
    fields: [
      {
        name: MESSAGES.FIELDS.MENTION_SERVER,
        value: server,
      },
      {
        name: MESSAGES.FIELDS.MENTION_USER,
        value: name,
      },
      {
        name: MESSAGES.FIELDS.CONTENT,
        value: text,
      },
    ],
  };

  return sendDiscordNotification(webhookUrl, embed);
}
