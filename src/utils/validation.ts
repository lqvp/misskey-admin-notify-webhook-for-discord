import { MESSAGES } from '@/constants';
import type { WebhookPayload } from '@/types';

/**
 * 安全なJSON解析
 * @param text JSON文字列
 * @returns パース結果またはnull
 */
export function safeParseJSON(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * WebhookペイロードかどうかをType Guardで判定
 * @param obj 判定対象のオブジェクト
 * @returns WebhookPayloadかどうか
 */
export function isWebhookPayload(obj: unknown): obj is WebhookPayload {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const payload = obj as Record<string, unknown>;

  if (typeof payload.type !== 'string' || typeof payload.server !== 'string') {
    return false;
  }

  switch (payload.type) {
    case 'userCreated': {
      const body = payload.body as Record<string, unknown> | null | undefined;
      return !!(
        body &&
        typeof body === 'object' &&
        typeof body.id === 'string' &&
        typeof body.username === 'string'
      );
    }

    case 'abuseReport': {
      const body = payload.body as Record<string, unknown> | null | undefined;
      return !!(
        body &&
        typeof body === 'object' &&
        typeof body.targetUserId === 'string' &&
        typeof body.reporterId === 'string' &&
        typeof body.comment === 'string'
      );
    }

    case 'abuseReportResolved': {
      const body = payload.body as Record<string, unknown> | null | undefined;
      return !!(
        body &&
        typeof body === 'object' &&
        typeof body.targetUserId === 'string' &&
        typeof body.reporterId === 'string' &&
        typeof body.assigneeId === 'string' &&
        typeof body.comment === 'string'
      );
    }

    case 'mention':
    case 'reply': {
      const body = payload.body as Record<string, unknown> | null | undefined;
      if (!body || typeof body !== 'object') return false;

      const note = body.note as Record<string, unknown> | null | undefined;
      if (!note || typeof note !== 'object') return false;

      const user = note.user as Record<string, unknown> | null | undefined;
      if (!user || typeof user !== 'object') return false;

      return !!(typeof user.name === 'string' && typeof note.text === 'string');
    }

    case 'inactiveModeratorsWarning':
    case 'inactiveModeratorsInvitationOnlyChanged':
      return true;

    case 'receivedContactForm': {
      const body = payload.body as Record<string, unknown> | null | undefined;
      return !!(
        body &&
        typeof body === 'object' &&
        typeof body.id === 'string' &&
        typeof body.subject === 'string' &&
        typeof body.content === 'string'
      );
    }

    default:
      return false;
  }
}

/**
 * 環境変数の検証
 * @param env 環境変数オブジェクト
 * @returns 検証結果とエラーメッセージ
 */
export function validateEnvironment(env: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!env || typeof env !== 'object') {
    return { isValid: false, error: 'Environment is not an object' };
  }

  const envObj = env as Record<string, unknown>;

  if (!envObj.SECRET || typeof envObj.SECRET !== 'string') {
    return { isValid: false, error: 'SECRET environment variable is missing' };
  }

  if (!envObj.DISCORD || typeof envObj.DISCORD !== 'string') {
    return {
      isValid: false,
      error: MESSAGES.ERRORS.NO_DISCORD_URL,
    };
  }

  return { isValid: true };
}
