import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, serverUrl, token, functionsVersion } = appParams;

// SDK only applies default serverUrl (https://base44.app) when the value is undefined — not null.
// On external hosts (e.g. Vercel) without env/localStorage, app-params can be null and would otherwise produce baseURL "null/api".
const resolvedServerUrl = serverUrl ? String(serverUrl).trim() || undefined : undefined;
const resolvedFunctionsVersion = functionsVersion ? String(functionsVersion).trim() || undefined : undefined;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  serverUrl: resolvedServerUrl,
  token,
  functionsVersion: resolvedFunctionsVersion,
  requiresAuth: false
});
