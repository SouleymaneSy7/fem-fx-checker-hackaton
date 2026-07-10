import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import { ArrowRightIcon } from "@/components/icons";
import DeleteButton from "@/components/shared/delete-button";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { useAlerts } from "@/hooks/use-alerts";
import { cn } from "@/lib/utils";

const AlertsPanel = () => {
  const { alerts, removeAlert, resetAlert } = useAlerts();

  const hasAlerts = alerts.length > 0;

  return (
    <React.Fragment>
      {hasAlerts ? (
        <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
          <div className="flex flex-wrap items-baseline justify-between gap-step-100">
            <Title
              level="h3"
              className="preset-3-med uppercase text-foreground"
            >
              Rate alerts
            </Title>

            <p className="preset-5 text-neutral-100 truncate">
              {alerts.length} alerts
            </p>
          </div>

          <List
            items={alerts}
            keyExtractor={(alert) => alert.id}
            className="flex flex-col gap-step-150"
            renderItem={(alert) => {
              const symbol = alert.condition === "above" ? "≥" : "≤";
              const isTriggered = alert.triggeredAt !== null;

              return (
                <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:gap-step-250 md:px-step-200">
                  <div className="flex-1 flex flex-col gap-step-075">
                    <div className="flex items-center gap-step-100">
                      <p className="preset-4 uppercase text-foreground">
                        {alert.fromCurrency}
                      </p>

                      <ArrowRightIcon className="text-neutral-200" size={12} />

                      <p className="preset-4 uppercase text-foreground">
                        {alert.toCurrency}
                      </p>
                    </div>

                    <p className="preset-5 uppercase text-neutral-200">
                      {symbol} {alert.threshold.toFixed(2)}
                    </p>
                  </div>

                  <p
                    className={cn(
                      "preset-6 uppercase",
                      isTriggered ? "text-primary" : "text-neutral-200",
                    )}
                  >
                    {isTriggered ? "Triggered" : "Watching"}
                  </p>

                  {isTriggered && (
                    <Button
                      type="button"
                      variant={"secondary"}
                      aria-label={`Re-enable alert: ${alert.fromCurrency} to ${alert.toCurrency}`}
                      onClick={() => resetAlert(alert.id)}
                    >
                      Reset
                    </Button>
                  )}

                  <DeleteButton
                    onClick={() => removeAlert(alert.id)}
                    label={`Delete alert: ${alert.fromCurrency} to ${alert.toCurrency}`}
                  />
                </li>
              );
            }}
          />
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No rate alerts yet</EmptyTitle>

          <EmptyDescription>
            Tap the bell icon on the converter to get notified when a pair
            crosses a rate you care about.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default AlertsPanel;
