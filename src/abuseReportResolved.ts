import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { AbuseReportResolvedPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';
import { getUserNames } from '@/utils/getUserName';

export default async function abuseReportResolved(
  payload: AbuseReportResolvedPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server, body } = payload;
  const { targetUserId, reporterId, assigneeId, comment } = body;

  // 並列でユーザー名を取得
  const [targetUserName, reporterUserName, assigneeUserName] =
    await getUserNames(server, [targetUserId, reporterId, assigneeId]);

  const embed = {
    title: MESSAGES.ABUSE_REPORT_RESOLVED_TITLE,
    color: DISCORD_COLORS.ABUSE_REPORT_RESOLVED,
    description: MESSAGES.ABUSE_REPORT_RESOLVED_DESCRIPTION(comment, server),
    fields: [
      {
        name: MESSAGES.FIELDS.REPORTED_USER,
        value: `[${targetUserName}](${server}/users/${targetUserId})`,
        inline: true,
      },
      {
        name: MESSAGES.FIELDS.REPORTER_USER,
        value: `[${reporterUserName}](${server}/users/${reporterId})`,
        inline: true,
      },
      {
        name: MESSAGES.FIELDS.RESOLVER_USER,
        value: `[${assigneeUserName}](${server}/users/${assigneeId})`,
        inline: true,
      },
    ],
  };

  return sendDiscordNotification(webhookUrl, embed);
}
