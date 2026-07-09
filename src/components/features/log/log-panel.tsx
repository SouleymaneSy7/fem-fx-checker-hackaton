import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import { ArrowRightIcon, ArrowUpFromLineIcon } from "@/components/icons";
import DeleteButton from "@/components/shared/delete-button";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { useLogMutations } from "@/hooks/use-log-mutations";
import { useLogStore } from "@/store/log-store";
import { exportLogToCsv } from "@/utils/export-log";
import { formatAmount } from "@/utils/format-amount";
import { formatRelativeTime } from "@/utils/format-date";

const LogPanel = () => {
  const entries = useLogStore((state) => state.entries);
  const { removeLogEntry, clearAllLogs } = useLogMutations();

  const hasEntries = entries.length > 0;
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
                  <Button type="button" onClick={() => exportLogToCsv(entries)}>
                    <ArrowUpFromLineIcon />
                    Export CSV
                  </Button>

                  <Button
                    type="button"
                    variant={"secondary"}
                    onClick={clearAllLogs}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>

          <List
            items={entries}
            keyExtractor={(entry) => entry.id}
            className="flex flex-col gap-step-150"
            renderItem={(entry) => (
              <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:gap-step-200 md:p-step-200">
                <div className="flex-1 flex flex-col gap-step-050 md:flex-row md:items-center">
                  <p className="shrink-0 preset-4 uppercase text-neutral-200 md:w-step-1000">
                    {formatRelativeTime(
                      new Date(entry.createdAt).toISOString(),
                    )}
                  </p>

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
                  onClick={() => removeLogEntry(entry.id)}
                  label={`Delete logged conversion from ${entry.fromCurrency} to ${entry.toCurrency}`}
                />
              </li>
            )}
          />
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No conversions logged yet</EmptyTitle>

          <EmptyDescription>
            Every conversion is recorded here automatically when you tap LOG
            CONVERSION. Your log is private to this session and this browser.{" "}
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default LogPanel;
