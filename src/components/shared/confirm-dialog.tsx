"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import * as React from "react";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BACKDROP_DURATION_SECONDS,
  SPRING_PANEL,
  STAGGER_DELAY_SECONDS,
} from "@/constants";
import type { ConfirmDialogPropsType, StaggerItemPropsType } from "@/types";

const StaggerItem = ({
  children,
  index,
  shouldReduceMotion,
}: StaggerItemPropsType) => (
  <motion.div
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(8px)" }
    }
    animate={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 1, transform: "translateY(0px)" }
    }
    exit={
      shouldReduceMotion
        ? { opacity: 0, transition: { duration: 0 } }
        : {
            opacity: 0,
            transform: "translateY(4px)",
            transition: { duration: 0.12 },
          }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            duration: 0.25,
            bounce: 0,
            delay: index * STAGGER_DELAY_SECONDS,
          }
    }
  >
    {children}
  </motion.div>
);

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "destructive",
}: ConfirmDialogPropsType) => {
  const shouldReduceMotion = useReducedMotion();

  const [showContent, setShowContent] = React.useState(false);
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (open && !wasOpenRef.current) setShowContent(true);
    wasOpenRef.current = open;
  }, [open]);

  const handlePanelAnimationComplete = () => {
    if (!open) setShowContent(false);
  };

  return (
    <AlertDialogPrimitive.Root
      open={open || showContent}
      onOpenChange={onOpenChange}
    >
      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {open && (
          <AlertDialogPrimitive.Portal forceMount>
            <AlertDialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : BACKDROP_DURATION_SECONDS,
                }}
              />
            </AlertDialogPrimitive.Overlay>

            <AlertDialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] space-y-step-200 rounded-16 border border-neutral-500 bg-card p-step-250 shadow-sm dark:shadow-lg dark:border-neutral-600 sm:max-w-100"
                initial={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -48%) scale(0.95)",
                      }
                }
                animate={{
                  opacity: 1,
                  transform: "translate(-50%, -50%) scale(1)",
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                        transition: { duration: 0.15 },
                      }
                }
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
                onAnimationComplete={handlePanelAnimationComplete}
              >
                <StaggerItem index={0} shouldReduceMotion={shouldReduceMotion}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {description}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </StaggerItem>

                <StaggerItem index={1} shouldReduceMotion={shouldReduceMotion}>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                      variant={confirmVariant}
                      onClick={onConfirm}
                    >
                      {confirmLabel}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </StaggerItem>
              </motion.div>
            </AlertDialogPrimitive.Content>
          </AlertDialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </AlertDialogPrimitive.Root>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
