"use client";

import * as React from "react";
import { toast } from "sonner";

import { Container, List, Title } from "@/components/common";
import { Button, Spinner } from "@/components/ui";
import { useSessions } from "@/hooks";
import { authClient, useSession } from "@/lib/auth-client";
import { formatFullDateTime, parseUserAgent } from "@/utils";

const SessionsPanel = () => {
  const { data: currentSession } = useSession();
  const { sessions, isLoading, mutate } = useSessions();
  const [revokingId, setRevokingId] = React.useState<string | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = React.useState(false);

  const handleRevoke = async (token: string, id: string) => {
    setRevokingId(id);

    try {
      const { error } = await authClient.revokeSession({ token });

      if (error) {
        toast.error(error.message ?? "Couldn't revoke that session.");
        return;
      }

      toast.success("Session revoked.");
      mutate();
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeOthers = async () => {
    setIsRevokingOthers(true);

    try {
      const { error } = await authClient.revokeOtherSessions();

      if (error) {
        toast.error(error.message ?? "Couldn't revoke other sessions.");
        return;
      }

      toast.success("Every other session has been signed out.");
      mutate();
    } finally {
      setIsRevokingOthers(false);
    }
  };

  const otherSessionsCount = sessions.filter(
    (item) => item.id !== currentSession?.session.id,
  ).length;

  return (
    <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-100">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Active sessions
        </Title>

        {otherSessionsCount > 0 && (
          <Button
            type="button"
            variant="secondary"
            disabled={isRevokingOthers}
            aria-busy={isRevokingOthers}
            onClick={handleRevokeOthers}
          >
            {isRevokingOthers && <Spinner aria-hidden="true" />}
            Sign out other sessions
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-step-300">
          <Spinner className="text-neutral-200" />
        </div>
      ) : (
        <List
          items={sessions}
          keyExtractor={(item) => item.id}
          className="flex flex-col gap-step-150"
          renderItem={(item) => {
            const { browser, os } = parseUserAgent(item.userAgent);
            const isCurrent = item.id === currentSession?.session.id;

            return (
              <li className="flex items-center gap-step-150 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:px-step-200">
                <div className="flex flex-1 flex-col gap-step-050">
                  <p className="preset-4 text-foreground">
                    {browser} on {os}
                    {isCurrent && (
                      <span className="preset-6 ml-step-100 text-primary uppercase">
                        This device
                      </span>
                    )}
                  </p>

                  <p className="preset-6 text-neutral-200">
                    Last active{" "}
                    {formatFullDateTime(new Date(item.updatedAt).toISOString())}
                  </p>
                </div>

                {!isCurrent && (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={revokingId === item.id}
                    aria-busy={revokingId === item.id}
                    onClick={() => handleRevoke(item.token, item.id)}
                  >
                    {revokingId === item.id && <Spinner aria-hidden="true" />}
                    Sign out
                  </Button>
                )}
              </li>
            );
          }}
        />
      )}
    </Container>
  );
};

export default SessionsPanel;
