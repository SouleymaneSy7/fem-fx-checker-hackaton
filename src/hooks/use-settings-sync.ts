"use client";

import * as React from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { updateSettings } from "@/services";
import type { UpdateSettingsInputType } from "@/types";

const SETTINGS_SYNC_DEBOUNCE_MS = 500;

/**
 * Thin sync layer over the settings-related Zustand stores (preferences,
 * theme, compare currencies, compare chart currencies). Those stores
 * keep their own setters exactly as they already are — this hook
 * doesn't replace them, it rides alongside: call the store's own setter
 * for instant local UI feedback, then call `syncSetting` with the same
 * field(s) so the change also lands in `user_settings` once signed in.
 * A no-op while signed out.
 *
 * Debounced for the same reason as converter-url-sync.tsx's
 * URL_SYNC_DEBOUNCE_MS: a text field like "Default amount" fires this on
 * every keystroke, and PATCHing on every keystroke would both hammer the
 * write rate limit and send requests immediately superseded by the next
 * one. A toggle or a picker selection only ever fires once per click, so
 * the debounce is just a harmless, uniform delay for those.
 *
 * Multiple fields changed within the debounce window get coalesced into
 * a single PATCH rather than one request per field.
 */
export function useSettingsSync() {
  const { data: session } = useSession();

  const sessionRef = React.useRef(session);
  sessionRef.current = session;

  const pendingRef = React.useRef<Partial<UpdateSettingsInputType>>({});
  const timeoutRef = React.useRef<number | null>(null);

  const flush = React.useCallback(() => {
    if (Object.keys(pendingRef.current).length === 0) return;

    const payload = pendingRef.current;
    pendingRef.current = {};

    updateSettings(payload as UpdateSettingsInputType).catch(() => {
      toast.error(
        "Couldn't save that setting to your account — it'll stay changed on this device only.",
        { id: "settings-sync-error" },
      );
    });
  }, []);

  // Flushes on unmount rather than dropping whatever was still pending —
  // e.g. navigating away from Settings right after a change, before the
  // debounce timer fired.
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      flush();
    };
  }, [flush]);

  const syncSetting = React.useCallback(
    (partial: UpdateSettingsInputType) => {
      if (!sessionRef.current) return;

      pendingRef.current = { ...pendingRef.current, ...partial };

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(flush, SETTINGS_SYNC_DEBOUNCE_MS);
    },
    [flush],
  );

  return { syncSetting };
}
