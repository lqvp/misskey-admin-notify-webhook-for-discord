export interface Env {
  SECRET: string;
  DISCORD: string;
}

export interface DiscordEmbed {
  title: string;
  color: number;
  description?: string;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

interface BasePayload {
  server: string;
}

export interface UserCreatedPayload extends BasePayload {
  type: 'userCreated';
  body: {
    id: string;
    username: string;
  };
}

export interface AbuseReportPayload extends BasePayload {
  type: 'abuseReport';
  body: {
    targetUserId: string;
    reporterId: string;
    comment: string;
  };
}

export interface AbuseReportResolvedPayload extends BasePayload {
  type: 'abuseReportResolved';
  body: {
    targetUserId: string;
    reporterId: string;
    assigneeId: string;
    comment: string;
  };
}

export interface MentionPayload extends BasePayload {
  type: 'mention' | 'reply';
  body: {
    note: {
      user: {
        name: string;
      };
      text: string;
    };
  };
}

export interface InactiveModeratorsWarningPayload extends BasePayload {
  type: 'inactiveModeratorsWarning';
}

export interface InactiveModeratorsInvitationOnlyChangedPayload
  extends BasePayload {
  type: 'inactiveModeratorsInvitationOnlyChanged';
}

export interface ReceivedContactFormPayload extends BasePayload {
  type: 'receivedContactForm';
  body: {
    id: string;
    subject: string;
    content: string;
    name?: string;
    email?: string;
    misskeyUsername?: string;
    replyMethod?: 'email' | 'misskey';
    category?: string;
    user?: {
      id: string;
      name?: string;
      username: string;
    };
  };
}

export type WebhookPayload =
  | UserCreatedPayload
  | AbuseReportPayload
  | AbuseReportResolvedPayload
  | MentionPayload
  | InactiveModeratorsWarningPayload
  | InactiveModeratorsInvitationOnlyChangedPayload
  | ReceivedContactFormPayload;

export type WebhookHandler<T extends WebhookPayload = WebhookPayload> = (
  payload: T,
  webhookUrl: string
) => Promise<boolean>;
