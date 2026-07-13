"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import LoadingStatus from "@/components/common/loading-status";
import LiquidWaveSpinner from "@/components/loaders/liquid-wave";
import { useAppReadiness } from "@/hooks/use-app-readiness";
import type { AppLoaderPropsType } from "@/types/ui.types";

/**
 * Full-screen splash shown on first visit. `children` mount immediately
 * underneath it — their SWR requests start right away — the overlay just
 * hides the page until `useAppReadiness` reports everything is loaded,
 * then fades out once and never comes back.
 */
const AppLoader = ({ children }: AppLoaderPropsType) => {
  const isReady = useAppReadiness();

  // Locks background scroll while the splash covers the page — restored
  // the instant it's gone, and on unmount as a safety net.
  React.useEffect(() => {
    document.body.style.overflow = isReady ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isReady]);

  return (
    <React.Fragment>
      <AnimatePresence>
        {!isReady && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-step-200"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingStatus label="Loading FX Checker">
              <LiquidWaveSpinner size="lg" className="max-w-90" />
            </LoadingStatus>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </React.Fragment>
  );
};

AppLoader.displayName = "AppLoader";

export default AppLoader;
