import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { InactiveModeratorsWarningPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';

export default async function inactiveModeratorsWarning(
  payload: InactiveModeratorsWarningPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server } = payload;

  const embed = {
    title: MESSAGES.MODERATOR_WARNING_TITLE,
    color: DISCORD_COLORS.MODERATOR_WARNING,
    description: MESSAGES.MODERATOR_WARNING_DESCRIPTION(server),
  };

  return sendDiscordNotification(webhookUrl, embed);
}
