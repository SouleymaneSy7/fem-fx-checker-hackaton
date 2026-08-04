// Plays a short two-tone chime via the Web Audio API — no audio asset
// file needed, and nothing to preload. A fresh AudioContext per call is
// intentional: alerts fire rarely enough (see use-alerts-watcher.ts) that
// there's no meaningful cost to it, and it avoids keeping a persistent
// context (and its "not yet resumed" browser quirk) alive for the whole
// session.
export function playAlertSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const now = context.currentTime;

    const playTone = (
      frequency: number,
      startOffset: number,
      duration: number,
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0, now + startOffset);
      gain.gain.linearRampToValueAtTime(0.2, now + startOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + startOffset + duration,
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(now + startOffset);
      oscillator.stop(now + startOffset + duration);
    };

    playTone(880, 0, 0.15); // A5
    playTone(1174.66, 0.12, 0.2); // D6

    window.setTimeout(() => context.close(), 500);
  } catch {
    // Web Audio unavailable or blocked (e.g. autoplay policy without
    // prior user interaction) — silently skip rather than throw, since a
    // missed chime shouldn't break the alert itself.
  }
}
