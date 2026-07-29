import { Container } from "@/components/common";
import { Marquee, MarqueeHeader, MarqueeTitle, Spinner } from "@/components/ui";

/**
 * Shown while `useTicker` is loading (see layout/header.tsx). Reuses the
 * exact same Marquee/MarqueeHeader wrapper as the real Ticker — same
 * "Live Markets" pill, same `py-step-150` vertical rhythm as a
 * TickerItem — so the header doesn't change height once live pairs
 * arrive. The spinner sits centered rather than left-aligned so it's
 * never hidden under the pill, whatever width "Live Markets" renders at.
 *
 */
const TickerLoading = () => {
  return (
    <Container
      as="section"
      className="container-ticker"
      aria-label="Live markets"
    >
      <Marquee>
        <MarqueeHeader>
          <span className="size-step-075 rounded-full bg-background" />
          <MarqueeTitle>Live Markets</MarqueeTitle>
        </MarqueeHeader>

        <div className="flex items-center justify-center py-step-150">
          <Spinner
            aria-label="Loading live markets"
            className="text-neutral-200"
          />
        </div>
      </Marquee>
    </Container>
  );
};

TickerLoading.displayName = "TickerLoading";

export default TickerLoading;
