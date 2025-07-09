/**
 * Misskey Admin Notification Webhook for Discord
 * Cloudflare Workers implementation
 */

import abuseReport from './abuseReport';
import abuseReportResolved from './abuseReportResolved';
import { MESSAGES } from './constants';
import inactiveModeratorsInvitationOnlyChanged from './inactiveModeratorsInvitationOnlyChanged';
import inactiveModeratorsWarning from './inactiveModeratorsWarning';
import mention from './mention';
import receivedContactForm from './receivedContactForm';
import type { Env, WebhookHandler, WebhookPayload } from './types';
import userCreated from './userCreated';
import {
  isWebhookPayload,
  safeParseJSON,
  validateEnvironment,
} from './utils/validation';

const handlers = new Map<string, WebhookHandler>([
  ['userCreated', userCreated as WebhookHandler],
  ['abuseReport', abuseReport as WebhookHandler],
  ['abuseReportResolved', abuseReportResolved as WebhookHandler],
  ['inactiveModeratorsWarning', inactiveModeratorsWarning as WebhookHandler],
  [
    'inactiveModeratorsInvitationOnlyChanged',
    inactiveModeratorsInvitationOnlyChanged as WebhookHandler,
  ],
  ['receivedContactForm', receivedContactForm as WebhookHandler],
  ['mention', mention as WebhookHandler],
  ['reply', mention as WebhookHandler],
]);

export default {
  async fetch(request: Request, env: unknown): Promise<Response> {
    try {
      const envValidation = validateEnvironment(env);
      if (!envValidation.isValid) {
        console.error('Environment validation failed:', envValidation.error);
        return new Response(envValidation.error, { status: 500 });
      }

      const typedEnv = env as Env;

      const hookSecret = request.headers.get('X-Misskey-Hook-Secret');
      if (hookSecret !== typedEnv.SECRET) {
        console.log('Wrong secret provided');
        return new Response(MESSAGES.ERRORS.WRONG_SECRET, { status: 401 });
      }

      const reqBody = await request.text();
      if (!reqBody) {
        console.log('No body in request');
        return new Response(MESSAGES.ERRORS.NO_BODY, { status: 400 });
      }

      const parsedBody = safeParseJSON(reqBody);
      if (!parsedBody) {
        console.log('Invalid JSON in request body');
        return new Response('Invalid JSON', { status: 400 });
      }

      if (!isWebhookPayload(parsedBody)) {
        console.log('Invalid webhook payload structure:', parsedBody);
        return new Response('Invalid webhook payload', { status: 400 });
      }

      const payload = parsedBody as WebhookPayload;

      const handler = handlers.get(payload.type);
      if (!handler) {
        console.log('Unknown webhook type:', payload.type);
        return new Response(MESSAGES.ERRORS.UNKNOWN_TYPE, { status: 400 });
      }

      const success = await handler(payload, typedEnv.DISCORD);

      return new Response(success ? 'ok' : 'error', {
        status: success ? 200 : 500,
      });
    } catch (error) {
      console.error('Unexpected error in webhook handler:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },
};
