import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import { ArrowRightIcon } from "@/components/icons";
import DeleteButton from "@/components/shared/delete-button";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { formatRelativeTime } from "@/utils/format-date";

export type LogEntryType = {
  id: string;
  loggedAt: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
};

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const LogEntriesPlaceholders = [
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0).toISOString(), // aujourd'hui
    sendAmount: 1000,
    sendCurrency: "USD",
    receiveCurrency: "EUR",
    receiveAmount: 853.02,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    sendAmount: 2500,
    sendCurrency: "EUR",
    receiveCurrency: "GBP",
    receiveAmount: 2145.75,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    sendAmount: 500,
    sendCurrency: "GBP",
    receiveCurrency: "USD",
    receiveAmount: 682.4,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    sendAmount: 12000,
    sendCurrency: "USD",
    receiveCurrency: "JPY",
    receiveAmount: 1856430,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    sendAmount: 800,
    sendCurrency: "CAD",
    receiveCurrency: "USD",
    receiveAmount: 578.65,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    sendAmount: 4500,
    sendCurrency: "EUR",
    receiveCurrency: "CHF",
    receiveAmount: 4187.25,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    sendAmount: 1500,
    sendCurrency: "AUD",
    receiveCurrency: "USD",
    receiveAmount: 987.45,
  },
  {
    id: crypto.randomUUID(),
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    sendAmount: 750,
    sendCurrency: "USD",
    receiveCurrency: "MXN",
    receiveAmount: 14825.6,
  },
];

const LogPanel = () => {
  const hasEntries = LogEntriesPlaceholders.length > 0;

  return (
    <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-250 py-step-250 px-step-200 md:p-step-250">
      <div className="flex flex-col flex-wrap gap-step-125 md:flex-row md:items-center md:justify-between">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Conversion log
        </Title>

        <div className="flex items-center justify-between gap-step-200 md:justify-start">
          <p className="preset-5 text-neutral-100">
            {LogEntriesPlaceholders.length} logged
          </p>

          {hasEntries && (
            <Button type="button" variant={"secondary"}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {hasEntries ? (
        <List
          items={LogEntriesPlaceholders}
          keyExtractor={(entry) => entry.id}
          className="flex flex-col gap-step-150"
          renderItem={(entry) => (
            <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:gap-step-200 md:p-step-200">
              <div className="flex-1 flex flex-col gap-step-050 md:flex-row md:items-center">
                <p className="shrink-0 preset-4 uppercase text-neutral-200 md:w-step-1000">
                  {formatRelativeTime(entry.loggedAt)}
                </p>

                <div className="flex items-center gap-step-100">
                  <p className="preset-4 uppercase text-foreground">
                    {entry.sendCurrency}
                  </p>

                  <ArrowRightIcon className="text-neutral-200" size={12} />

                  <p className="preset-4 uppercase text-foreground">
                    {entry.receiveCurrency}
                  </p>
                </div>
              </div>

              <p className="preset-3 text-neutral-100 uppercase">
                {formatAmount(entry.sendAmount)}{" "}
              </p>

              <p className="preset-3 text-primary uppercase">
                {formatAmount(entry.receiveAmount)}
              </p>

              <DeleteButton />
            </li>
          )}
        />
      ) : (
        <Empty>
          <EmptyTitle>No conversions logged yet</EmptyTitle>
          <EmptyDescription>
            Every conversion is recorded here automatically when you tap LOG
            CONVERSION. Your log is private to this session and this browser.{" "}
          </EmptyDescription>
        </Empty>
      )}
    </Container>
  );
};

export default LogPanel;
