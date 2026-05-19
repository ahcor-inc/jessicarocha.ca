/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_BUTTONDOWN_USERNAME: string;
  readonly PUBLIC_CONTACT_FORM_ENDPOINT: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TurnstileAPI {
  getResponse: (widgetId?: string) => string | undefined;
  reset: (widgetId?: string) => void;
  render?: (container: string | HTMLElement, options: Record<string, unknown>) => string;
}

interface Window {
  turnstile?: TurnstileAPI;
}
