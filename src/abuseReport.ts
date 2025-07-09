import { DISCORD_COLORS, MESSAGES } from '@/constants';
import type { AbuseReportPayload } from '@/types';
import { sendDiscordNotification } from '@/utils/discord';
import { getUserNames } from '@/utils/getUserName';

export default async function abuseReport(
  payload: AbuseReportPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server, body } = payload;
  const { targetUserId, reporterId, comment } = body;

  // 並列でユーザー名を取得
  const [targetUserName, reporterUserName] = await getUserNames(server, [
    targetUserId,
    reporterId,
  ]);

  const embed = {
    title: MESSAGES.ABUSE_REPORT_TITLE,
    color: DISCORD_COLORS.ABUSE_REPORT,
    description: MESSAGES.ABUSE_REPORT_DESCRIPTION(comment, server),
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
    ],
  };

  return sendDiscordNotification(webhookUrl, embed);
}
