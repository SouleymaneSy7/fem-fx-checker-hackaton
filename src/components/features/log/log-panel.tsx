import * as React from "react";
import { toast } from "sonner";
import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import { ArrowRightIcon, ArrowUpFromLineIcon } from "@/components/icons";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import DeleteButton from "@/components/shared/delete-button";
import TextTooltip from "@/components/shared/text-tooltip";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogMutations } from "@/hooks/use-log-mutations";
import { useLogStore } from "@/store/log-store";
import { exportLogToCsv } from "@/utils/export-log";
import { formatAmount } from "@/utils/format-amount";
import { formatFullDateTime, formatRelativeTime } from "@/utils/format-date";

type PendingLogActionType =
  | { kind: "clear-all" }
  | {
      kind: "delete-entry";
      id: string;
      fromCurrency: string;
      toCurrency: string;
    };

const LogPanel = () => {
  const entries = useLogStore((state) => state.entries);
  const { removeLogEntry, clearAllLogs } = useLogMutations();

  const [pendingAction, setPendingAction] =
    React.useState<PendingLogActionType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const hasEntries = entries.length > 0;

  const openConfirm = (action: PendingLogActionType) => {
    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingAction?.kind === "clear-all") {
      clearAllLogs();
    } else if (pendingAction?.kind === "delete-entry") {
      removeLogEntry(pendingAction.id);
    }

    setIsConfirmOpen(false);
  };

  let confirmTitle = "";
  let confirmDescription = "";
  let confirmLabel = "Delete";

  if (pendingAction?.kind === "clear-all") {
    confirmTitle = "Clear the conversion log?";
    confirmDescription = `This will permanently delete all ${entries.length} logged conversions. This action cannot be undone.`;
    confirmLabel = "Clear all";
  } else if (pendingAction?.kind === "delete-entry") {
    confirmTitle = "Delete this conversion?";
    confirmDescription = `This will permanently delete the logged conversion from ${pendingAction.fromCurrency} to ${pendingAction.toCurrency}. This action cannot be undone.`;
  }

  return (
    <React.Fragment>
      {hasEntries ? (
        <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-250 py-step-250 px-step-200 md:p-step-250">
          <div className="flex flex-col flex-wrap gap-step-125 md:flex-row md:items-center md:justify-between">
            <Title
              level="h3"
              className="preset-3-med text-foreground uppercase"
            >
              Conversion log
            </Title>

            <div className="flex items-center justify-between gap-step-200 md:justify-start">
              <p className="preset-5 text-neutral-100">
                {entries.length} logged
              </p>

              {hasEntries && (
                <div className="flex flex-wrap items-center gap-step-100 md:gap-step-150">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          exportLogToCsv(entries);
                          toast.success(
                            `Your ${entries.length} conversion${entries.length !== 1 ? "s have" : " has"} been exported as CSV.`,
                          );
                        }}
                        aria-label="Download your conversion history as a CSV file"
                      >
                        <ArrowUpFromLineIcon />
                        Export CSV
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      Download your conversion history as a CSV file
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() => openConfirm({ kind: "clear-all" })}
                        aria-label="Delete all logged conversions"
                      >
                        Clear all
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      Delete all logged conversions
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          <List
            items={entries}
            keyExtractor={(entry) => entry.id}
            className="flex flex-col gap-step-150"
            renderItem={(entry) => {
              const createdAtIso = new Date(entry.createdAt).toISOString();

              return (
                <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:gap-step-200 md:p-step-200">
                  <div className="flex-1 flex flex-col gap-step-050 md:flex-row md:items-center">
                    <TextTooltip
                      className="shrink-0 preset-4 uppercase text-neutral-200 md:w-step-1000"
                      content={formatFullDateTime(createdAtIso)}
                    >
                      {formatRelativeTime(createdAtIso)}
                    </TextTooltip>

                    <div className="flex items-center gap-step-100">
                      <p className="preset-4 uppercase text-foreground">
                        {entry.fromCurrency}
                      </p>

                      <ArrowRightIcon className="text-neutral-200" size={12} />

                      <p className="preset-4 uppercase text-foreground">
                        {entry.toCurrency}
                      </p>
                    </div>
                  </div>

                  <p className="preset-3 text-neutral-100 uppercase">
                    {formatAmount(entry.sendAmount)}{" "}
                  </p>

                  <p className="preset-3 text-primary uppercase">
                    {formatAmount(entry.receiveAmount)}
                  </p>

                  <DeleteButton
                    onClick={() =>
                      openConfirm({
                        kind: "delete-entry",
                        id: entry.id,
                        fromCurrency: entry.fromCurrency,
                        toCurrency: entry.toCurrency,
                      })
                    }
                    label={`Delete logged conversion from ${entry.fromCurrency} to ${entry.toCurrency}.`}
                  />
                </li>
              );
            }}
          />
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No conversions logged yet</EmptyTitle>

          <EmptyDescription>
            Every conversion is recorded here automatically when you tap Log
            Conversion. Your log is private to this session and this browser.{" "}
          </EmptyDescription>
        </Empty>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        onConfirm={handleConfirm}
      />
    </React.Fragment>
  );
};

export default LogPanel;
