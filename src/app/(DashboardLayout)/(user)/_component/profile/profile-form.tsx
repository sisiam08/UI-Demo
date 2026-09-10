"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/shared/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  INDUSTRY_OPTIONS,
  PROFILE_ROLE_LABELS,
  PROFILE_ROLES,
  SKILL_OPTIONS,
} from "@/constants/options";
import { envConfig } from "@/env";
import type { IProfileFormValues, ProfileRole } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createProfile,
  updateProfile,
  uploadProfilePhoto,
} from "@/services/profile.service";
import { useRouter } from "next/navigation";

const API_ORIGIN = new URL(envConfig.NEXT_PUBLIC_API_URL).origin;

const urlSchema = z
  .string()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Must be a valid URL");

const profileSchema = z.object({
  role: z.string().min(1, "Select your area of expertise"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interestedIndustries: z
    .array(z.string())
    .min(1, "Select at least one industry"),
  availableWeeklyCommitment: z
    .number()
    .min(1, "Must be enter your time commitment per week")
    .max(80, "Max 80 hours per week"),
  bio: z.string().max(2000, "Keep it under 2000 characters"),
  portfolioUrl: urlSchema,
  githubUrl: urlSchema,
  linkedinUrl: urlSchema,
  location: z.string(),
  photoUrl: z.string().nullable(),
});

export default function ProfileForm({
  initial,
  submitLabel,
  onSuccess,
}: {
  initial?: Partial<IProfileFormValues>;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial;

  const form = useForm({
    defaultValues: {
      role: initial?.role ?? "",
      skills: initial?.skills ?? [],
      interestedIndustries: initial?.interestedIndustries ?? [],
      availableWeeklyCommitment: initial?.availableWeeklyCommitment ?? 0,
      bio: initial?.bio ?? "",
      portfolioUrl: initial?.portfolioUrl ?? "",
      githubUrl: initial?.githubUrl ?? "",
      linkedinUrl: initial?.linkedinUrl ?? "",
      location: initial?.location ?? "",
      photoUrl: initial?.photoUrl ?? null,
    },
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      const profileData = {
        role: value.role as ProfileRole,
        skills: value.skills,
        interestedIndustries: value.interestedIndustries,
        availableWeeklyCommitment: value.availableWeeklyCommitment,
        bio: value.bio || undefined,
        portfolioUrl: value.portfolioUrl || undefined,
        githubUrl: value.githubUrl || undefined,
        linkedinUrl: value.linkedinUrl || undefined,
        location: value.location || undefined,
        photoUrl: value.photoUrl,
      };

      try {
        if (isEdit) {
          await updateProfile(profileData);
          toast.add({ type: "success", description: "Profile updated" });
          onSuccess?.();
        } else {
          await createProfile(profileData);
          toast.add({
            type: "success",
            description: "Profile created successfully",
          });
          router.push("/requirements/browse");
        }
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ type: "error", description: "Max 5MB allowed" });
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.add({
        type: "error",
        description: "Only JPEG, JPG, and PNG allowed",
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProfilePhoto(fd);
      form.setFieldValue("photoUrl", result.photoUrl);
      toast.add({ type: "success", description: "Photo uploaded" });
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const photoUrl = form.state.values.photoUrl;
  const photoSrc = photoUrl
    ? photoUrl.startsWith("http")
      ? photoUrl
      : `${API_ORIGIN}${photoUrl}`
    : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          {photoSrc && (
            <img
              src={photoSrc}
              alt="Profile"
              className="size-full rounded-full object-cover"
            />
          )}
          <AvatarFallback className="text-lg"></AvatarFallback>
        </Avatar>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhoto}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-4" />
            Upload photo
          </Button>
          {photoUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.setFieldValue("photoUrl", null)}
            >
              <X className="size-4" />
              Remove
            </Button>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, JPEG, or PNG. Max 5MB.
          </p>
        </div>
      </div>

      <FieldGroup>
        <form.Field
          name="role"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Role <span className="text-destructive">*</span>
                </FieldLabel>
                <p className="text-xs text-muted-foreground">
                  What is your primary area of expertise in a startup?
                </p>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as ProfileRole)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select your area of expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {PROFILE_ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="skills"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Skills <span className="text-destructive">*</span>
                </FieldLabel>
                <p className="text-xs text-muted-foreground">
                  Select your technical and professional skills. You can also
                  type your own.
                </p>
                <MultiSelect
                  value={field.state.value}
                  onChange={field.handleChange}
                  options={SKILL_OPTIONS}
                  placeholder="Select your skills..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="interestedIndustries"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Interested Industries{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <p className="text-xs text-muted-foreground">
                  Which industry sectors are you most interested in?
                </p>
                <MultiSelect
                  value={field.state.value}
                  onChange={field.handleChange}
                  options={INDUSTRY_OPTIONS}
                  placeholder="Select industries..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="availableWeeklyCommitment"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Weekly Availability (hours){" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <p className="text-xs text-muted-foreground">
                  How many hours per week can you commit to a co-founder
                  partnership?
                </p>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  max={80}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="Hours per week"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="bio"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={2000}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="portfolioUrl"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Portfolio URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your portfolio link"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="location"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="City, Country"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="githubUrl"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>GitHub URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your GitHub profile link"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="linkedinUrl"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>LinkedIn URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your LinkedIn profile link"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        })}
        children={({ isSubmitting, canSubmit }) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : (submitLabel ?? (isEdit ? "Save Changes" : "Create Profile"))}
          </Button>
        )}
      />
    </form>
  );
}
