"use client";

import * as React from "react";
import { toast } from "sonner";

import { Container, Title } from "@/components/common";
import { CameraIcon } from "@/components/icons";
import { TextInput } from "@/components/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import {
  AVATAR_MAX_UPLOAD_BYTES,
  EMAIL_OTP_LENGTH,
  TEST_ACCOUNT_EMAIL,
} from "@/constants";
import { updateUser, useSession } from "@/lib/auth-client";
import { confirmEmailChange, requestEmailChange } from "@/services";
import { getNameInitials, resizeImage } from "@/utils";
import {
  confirmEmailChangeSchema,
  requestEmailChangeSchema,
  updateNameSchema,
} from "@/validators";

type EmailChangeStepType = "idle" | "enterEmail" | "enterCode";

const ProfilePanel = () => {
  const { data: session } = useSession();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const [name, setName] = React.useState(session?.user.name ?? "");
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [isSavingName, setIsSavingName] = React.useState(false);

  const [emailStep, setEmailStep] = React.useState<EmailChangeStepType>("idle");
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isEmailSubmitting, setIsEmailSubmitting] = React.useState(false);

  if (!session) return null;

  const isDemoAccount = session.user.email === TEST_ACCOUNT_EMAIL;

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later

    if (!file) return;

    if (file.size > AVATAR_MAX_UPLOAD_BYTES) {
      toast.error("That image is too large — please pick one under 10MB.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const dataUri = await resizeImage(file);
      const { error } = await updateUser({ image: dataUri });

      if (error) {
        toast.error(error.message ?? "Couldn't update your photo.");
        return;
      }

      toast.success("Your photo has been updated.");
    } catch {
      toast.error("Couldn't process that image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveName = async () => {
    const result = updateNameSchema.safeParse({ name });

    if (!result.success) {
      setNameError(result.error.issues[0]?.message ?? "Invalid name.");
      return;
    }

    setNameError(null);
    setIsSavingName(true);

    try {
      const { error } = await updateUser({ name: result.data.name });

      if (error) {
        toast.error(error.message ?? "Couldn't update your name.");
        return;
      }

      toast.success("Your name has been updated.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSendCode = async () => {
    const result = requestEmailChangeSchema.safeParse({ newEmail });

    if (!result.success) {
      setEmailError(
        result.error.issues[0]?.message ?? "Invalid email address.",
      );
      return;
    }

    setEmailError(null);
    setIsEmailSubmitting(true);

    try {
      await requestEmailChange(result.data.newEmail);
      setNewEmail(result.data.newEmail);
      setEmailStep("enterCode");
      toast.success(`We sent a code to ${result.data.newEmail}.`);
    } catch (error) {
      setEmailError(
        error instanceof Error ? error.message : "Couldn't send a code.",
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleConfirmCode = async () => {
    const result = confirmEmailChangeSchema.safeParse({ otp });

    if (!result.success) {
      setOtpError(
        result.error.issues[0]?.message ??
          `Enter the ${EMAIL_OTP_LENGTH}-digit code.`,
      );
      return;
    }

    setOtpError(null);
    setIsEmailSubmitting(true);

    try {
      await confirmEmailChange(result.data.otp);
      toast.success("Your email address has been updated.");
      setEmailStep("idle");
      setOtp("");
      setNewEmail("");
    } catch (error) {
      setOtpError(
        error instanceof Error ? error.message : "That code didn't work.",
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleCancelEmailChange = () => {
    setEmailStep("idle");
    setNewEmail("");
    setOtp("");
    setEmailError(null);
    setOtpError(null);
  };

  return (
    <div className="space-y-step-200 md:space-y-step-250">
      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Profile photo
        </Title>

        <div className="flex items-center gap-step-200">
          <div className="relative">
            <Avatar className="h-16 w-16">
              {session.user.image && (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              )}

              <AvatarFallback className="preset-2 text-foreground uppercase">
                {getNameInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>

            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-900/60">
                <Spinner className="text-foreground" />
              </div>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={isUploadingAvatar}
                onClick={handleAvatarClick}
                aria-label="Change profile photo"
              >
                <CameraIcon className="text-foreground" />
                Change photo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              JPEG, PNG, or WebP — resized automatically
            </TooltipContent>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </div>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Name
        </Title>

        <div className="flex flex-col gap-step-150 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              label="Full name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(null);
              }}
              error={nameError ?? undefined}
            />
          </div>

          <Button
            type="button"
            variant="primary"
            disabled={isSavingName || name.trim() === session.user.name}
            aria-busy={isSavingName}
            onClick={handleSaveName}
          >
            {isSavingName && (
              <Spinner aria-hidden="true" className="text-primary-foreground" />
            )}
            {isSavingName ? "Saving..." : "Save"}
          </Button>
        </div>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Email address
        </Title>

        <p className="preset-4 text-neutral-100">{session.user.email}</p>

        {isDemoAccount ? (
          <p className="preset-5 text-neutral-200">
            Email changes are disabled for the shared demo account, so other
            visitors can keep using the published test credentials.
          </p>
        ) : emailStep === "idle" ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setEmailStep("enterEmail")}
          >
            Change email
          </Button>
        ) : emailStep === "enterEmail" ? (
          <div className="flex flex-col gap-step-150">
            <TextInput
              label="New email address"
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(event) => {
                setNewEmail(event.target.value);
                setEmailError(null);
              }}
              error={emailError ?? undefined}
            />

            <div className="flex gap-step-100">
              <Button
                type="button"
                variant="primary"
                disabled={isEmailSubmitting}
                aria-busy={isEmailSubmitting}
                onClick={handleSendCode}
              >
                {isEmailSubmitting && (
                  <Spinner
                    aria-hidden="true"
                    className="text-primary-foreground"
                  />
                )}
                {isEmailSubmitting ? "Sending..." : "Send code"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={isEmailSubmitting}
                onClick={handleCancelEmailChange}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-step-150">
            <p className="preset-5 text-neutral-200">
              Enter the {EMAIL_OTP_LENGTH}-digit code we sent to {newEmail}.
            </p>

            <TextInput
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={EMAIL_OTP_LENGTH}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                setOtpError(null);
              }}
              error={otpError ?? undefined}
            />

            <div className="flex gap-step-100">
              <Button
                type="button"
                variant="primary"
                disabled={isEmailSubmitting}
                aria-busy={isEmailSubmitting}
                onClick={handleConfirmCode}
              >
                {isEmailSubmitting && (
                  <Spinner
                    aria-hidden="true"
                    className="text-primary-foreground"
                  />
                )}
                {isEmailSubmitting ? "Confirming..." : "Confirm"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={isEmailSubmitting}
                onClick={handleCancelEmailChange}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProfilePanel;
