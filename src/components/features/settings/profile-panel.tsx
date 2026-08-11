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
  Badge,
  Button,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { AVATAR_MAX_UPLOAD_BYTES } from "@/constants";
import { updateUser, useSession } from "@/lib/auth-client";
import { getNameInitials, resizeImage } from "@/utils";
import { updateNameSchema } from "@/validators";

const ProfilePanel = () => {
  const { data: session } = useSession();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const [name, setName] = React.useState(session?.user.name ?? "");
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [isSavingName, setIsSavingName] = React.useState(false);

  if (!session) return null;

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

      toast.success("Your picture has been updated.");
    } catch {
      toast.error("Couldn't process that image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveName = async (event: React.SubmitEvent) => {
    event.preventDefault();

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

  return (
    <div className="space-y-step-200 md:space-y-step-250">
      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Profile photo
        </Title>

        <div className="flex flex-wrap items-center gap-step-200">
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

          <div className="flex flex-col gap-step-150">
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="capitalize"
                    disabled={isUploadingAvatar}
                    onClick={handleAvatarClick}
                    aria-label="Change profile photo"
                  >
                    <CameraIcon className="text-foreground" />
                    Change picture
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  JPEG, PNG, or WebP — resized automatically.
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

            <p className="preset-5 text-neutral-200">
              We support JPEG, PNG or WebP files under 10 MB. Images are resized
              automatically.
            </p>
          </div>
        </div>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Name
        </Title>

        <form
          onSubmit={handleSaveName}
          className="flex flex-col gap-step-150 sm:flex-row sm:items-end"
        >
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
            type="submit"
            variant="primary"
            className="sm:mb-0.5"
            disabled={isSavingName || name.trim() === session.user.name}
            aria-busy={isSavingName}
          >
            {isSavingName && (
              <Spinner aria-hidden="true" className="text-primary-foreground" />
            )}
            {isSavingName ? "Saving..." : "Save"}
          </Button>
        </form>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <div className="flex flex-wrap items-center justify-between gap-step-100">
          <Title level="h3" className="preset-3-med text-foreground uppercase">
            Email address
          </Title>

          <Badge>Coming soon</Badge>
        </div>

        <p className="preset-4 text-neutral-100">{session.user.email}</p>

        <p className="preset-5 text-neutral-200">
          Changing your email address isn't available yet — it's coming in a
          future update.
        </p>
      </Container>
    </div>
  );
};

export default ProfilePanel;
