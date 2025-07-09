import { CONFIG, DISCORD_COLORS, MESSAGES } from '@/constants';
import type { ReceivedContactFormPayload } from '@/types';
import {
  escapeMarkdown,
  sendDiscordNotification,
  truncateContent,
} from '@/utils/discord';

export default async function receivedContactForm(
  payload: ReceivedContactFormPayload,
  webhookUrl: string
): Promise<boolean> {
  const { server, body } = payload;
  const {
    id: contactFormId,
    subject,
    content,
    name,
    email,
    misskeyUsername,
    replyMethod,
    category,
    user,
  } = body;

  let senderName: string = MESSAGES.ANONYMOUS;
  let senderLink: string | null = null;

  if (user) {
    senderName = user.name || user.username;
    senderLink = `[${senderName}](${server}/users/${user.id})`;
  } else if (name) {
    senderName = name;
  }

  // 返信先情報
  let replyInfo: string = MESSAGES.UNKNOWN;
  if (replyMethod === 'email' && email) {
    replyInfo = `📧 ${email}`;
  } else if (replyMethod === 'misskey' && misskeyUsername) {
    replyInfo = `💬 ${misskeyUsername}`;
  }

  // コンテンツの長さ制限
  const truncatedContent = truncateContent(content, CONFIG.MAX_CONTENT_LENGTH);

  const embed = {
    title: MESSAGES.CONTACT_FORM_TITLE,
    color: DISCORD_COLORS.CONTACT_FORM,
    description: MESSAGES.CONTACT_FORM_DESCRIPTION(
      escapeMarkdown(subject),
      escapeMarkdown(truncatedContent),
      server
    ),
    fields: [
      {
        name: MESSAGES.FIELDS.SENDER,
        value: senderLink || escapeMarkdown(senderName),
        inline: true,
      },
      {
        name: MESSAGES.FIELDS.REPLY_METHOD,
        value: replyInfo,
        inline: true,
      },
      {
        name: MESSAGES.FIELDS.CATEGORY,
        value: escapeMarkdown(category || MESSAGES.UNKNOWN),
        inline: true,
      },
    ],
    footer: {
      text: `ID: ${contactFormId}`,
    },
    timestamp: new Date().toISOString(),
  };

  return sendDiscordNotification(webhookUrl, embed);
}
