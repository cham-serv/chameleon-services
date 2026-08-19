/**
 * Turnstile Component
 *
 * Cloudflare Turnstile CAPTCHA wrapper. Client Component.
 *
 * Loads the Turnstile script dynamically and renders the widget.
 * Falls back gracefully when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set
 * (renders nothing  allows development without Turnstile).
 *
 * Usage:
 *   <Turnstile onVerify={(token) => setToken(token)} />
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

type TurnstileProps = {
  /** Called with the verification token when the user passes */
  onVerify: (token: string) => void;
  /** Called when verification expires (user needs to re-verify) */
  onExpire?: () => void;
  /** Widget appearance mode */
  appearance?: 'always' | 'interaction-only';
  /** Widget theme */
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
};

// Extend window for Turnstile global
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';

export function Turnstile({
  onVerify,
  onExpire,
  appearance = 'always',
  theme = 'auto',
  className,
}: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token);
    },
    [onVerify],
  );

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;

      // Clear any previous widget
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Widget may already be removed
        }
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        'expired-callback': onExpire,
        appearance,
        theme,
      });
    };

    // If the script is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Load the script
    const existingScript = document.querySelector(
      `script[src^="https://challenges.cloudflare.com"]`,
    );

    if (!existingScript) {
      window.onTurnstileLoad = renderWidget;
      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      // Script exists but hasn't loaded yet  set the callback
      window.onTurnstileLoad = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Widget may already be removed
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, handleVerify, onExpire, appearance, theme]);

  // If no site key, render nothing (allows dev without Turnstile)
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY not set  widget disabled',
      );
    }
    return null;
  }

  return <div ref={containerRef} className={className} />;
}
