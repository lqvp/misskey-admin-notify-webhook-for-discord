export const DISCORD_COLORS = {
  USER_CREATED: 2326507, // 緑系
  ABUSE_REPORT: 15409955, // 赤系
  ABUSE_REPORT_RESOLVED: 3359727, // 青系
  MENTION: 9364310, // 紫系
  MODERATOR_WARNING: 14931798, // オレンジ系
  INVITATION_ONLY_CHANGED: 15409955, // 赤系
  CONTACT_FORM: 3066993, // 青系
} as const;

export const MESSAGES = {
  ABUSE_REPORT_TITLE: '通報がありました',
  ABUSE_REPORT_RESOLVED_TITLE: '通報を解決しました',
  ABUSE_REPORT_DESCRIPTION: (text: string, server: string) =>
    `通報がありました。\n### 通報内容\n ${text}\n### 通報があったサーバー\n${server}`,
  ABUSE_REPORT_RESOLVED_DESCRIPTION: (text: string, server: string) =>
    `通報が解決されました。\n### 通報内容\n ${text}\n### 通報があったサーバー\n${server}`,

  USER_CREATED_TITLE: '新規ユーザーが登録しました。',

  MENTION_TITLE: '管理人にメンションがありました。',

  MODERATOR_WARNING_TITLE: 'まもなく新規登録が招待制へ移行します',
  MODERATOR_WARNING_DESCRIPTION: (server: string) =>
    `### 注意\nモデレーターのアクティブが一定期間なかったため、まもなく新規登録が招待制へ移行します。\nモデレーターがログインすることで、この自動処理は中止されます。\n### 対象サーバー\n${server}`,

  INVITATION_ONLY_CHANGED_TITLE: '新規登録が招待制に移行されました',
  INVITATION_ONLY_CHANGED_DESCRIPTION: (server: string) =>
    `### 注意\nモデレーターのアクティブが一定期間なかったため、新規登録が招待制に移行しました。\n新規登録を開放したい場合は管理設定から変更してください。\n### 対象サーバー\n${server}`,

  CONTACT_FORM_TITLE: '📬 お問い合わせがありました',
  CONTACT_FORM_DESCRIPTION: (
    subject: string,
    content: string,
    server: string
  ) =>
    `新しいお問い合わせが届きました。\n### 📋 件名\n${subject}\n### 📝 内容\n${content}\n### 🌐 サーバー\n${server}`,

  FIELDS: {
    REPORTED_USER: '通報されたユーザー',
    REPORTER_USER: '通報を行ったユーザー',
    RESOLVER_USER: '通報を解決したユーザー',
    REGISTRATION_SERVER: '登録サーバー',
    USERNAME: 'ユーザー名',
    MENTION_SERVER: 'メンションがあったサーバー',
    MENTION_USER: 'メンションしたユーザー名',
    CONTENT: '内容',
    SENDER: '👤 送信者',
    REPLY_METHOD: '📞 返信方法',
    CATEGORY: '🏷️ カテゴリ',
  },

  ERRORS: {
    WRONG_SECRET: 'wrong secret',
    NO_DISCORD_URL: 'not found discord webhook url',
    NO_BODY: 'no body',
    UNKNOWN_TYPE: 'unknown webhook type',
    WEBHOOK_FAILED: 'Discord notification failed',
  },

  UNKNOWN_USER: (userId: string) => `Unknown User (${userId})`,
  ANONYMOUS: '匿名',
  UNKNOWN: '不明',
  CONTENT_TRUNCATED: '\n\n**[内容が長いため省略されました]**',
} as const;

export const CONFIG = {
  MAX_CONTENT_LENGTH: 500,
} as const;
