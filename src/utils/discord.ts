import { MESSAGES } from '@/constants';
import type { DiscordEmbed } from '@/types';

/**
 * Discord Webhookに通知を送信する共通ユーティリティ
 * @param webhookUrl Discord Webhook URL
 * @param embed Discord Embed オブジェクト
 * @returns 送信成功可否
 */
export async function sendDiscordNotification(
  webhookUrl: string,
  embed: DiscordEmbed
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) {
      console.error(
        `Discord webhook failed with status ${response.status}: ${response.statusText}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(MESSAGES.ERRORS.WEBHOOK_FAILED, error);
    return false;
  }
}

/**
 * Markdownエスケープ（Discord埋め込みで問題となる文字をエスケープ）
 * @param text エスケープ対象の文字列
 * @returns エスケープ済み文字列
 */
export function escapeMarkdown(text: string): string {
  return text
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/\|/g, '\\|');
}

/**
 * テキストの長さを制限し、必要に応じて切り詰める
 * @param content 元のテキスト
 * @param maxLength 最大文字数
 * @returns 切り詰め済みテキスト
 */
export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + MESSAGES.CONTENT_TRUNCATED;
}
