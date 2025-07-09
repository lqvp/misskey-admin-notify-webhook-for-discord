import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { InactiveModeratorsInvitationOnlyChangedPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';

export default async function inactiveModeratorsInvitationOnlyChanged(
  payload: InactiveModeratorsInvitationOnlyChangedPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server } = payload;

  const embed = {
    title: MESSAGES.INVITATION_ONLY_CHANGED_TITLE,
    color: DISCORD_COLORS.INVITATION_ONLY_CHANGED,
    description: MESSAGES.INVITATION_ONLY_CHANGED_DESCRIPTION(server),
  };

  return sendDiscordNotification(webhookUrl, embed);
}
