import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { UserCreatedPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';

export default async function userCreated(
  payload: UserCreatedPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server, body } = payload;
  const { username, id } = body;

  const embed = {
    title: MESSAGES.USER_CREATED_TITLE,
    color: DISCORD_COLORS.USER_CREATED,
    fields: [
      {
        name: MESSAGES.FIELDS.REGISTRATION_SERVER,
        value: server,
      },
      {
        name: MESSAGES.FIELDS.USERNAME,
        value: `[${username}](${server}/users/${id})`,
      },
    ],
  };

  return sendDiscordNotification(webhookUrl, embed);
}
