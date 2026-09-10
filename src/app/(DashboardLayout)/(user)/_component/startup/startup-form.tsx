"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { INDUSTRY_OPTIONS, STARTUP_STAGE_OPTIONS } from "@/constants/options";
import type { IStartupIdea, StartupStage } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createStartup,
  updateStartup,
  type StartupInput,
} from "@/services/startup.service";
import { useRouter } from "next/navigation";

const startupSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(160, "Keep it under 160 characters"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(255, "Keep it under 255 characters"),
  fullDescription: z.string().min(1, "Full description is required"),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  startupStage: z.string().min(1, "Select a stage"),
});

export default function StartupForm({ startup }: { startup?: IStartupIdea }) {
  const router = useRouter();
  const isEdit = !!startup;

  const form = useForm({
    defaultValues: {
      title: startup?.title ?? "",
      shortDescription: startup?.shortDescription ?? "",
      fullDescription: startup?.fullDescription ?? "",
      industries: startup?.industries ?? [],
      startupStage: (startup?.startupStage ?? "idea") as string,
    },
    validators: { onChange: startupSchema },
    onSubmit: async ({ value }) => {
      const payload: StartupInput = {
        title: value.title,
        shortDescription: value.shortDescription,
        fullDescription: value.fullDescription,
        industries: value.industries,
        startupStage: value.startupStage as StartupStage,
      };

      try {
        if (isEdit) {
          await updateStartup(startup.id, payload);
          toast.add({ type: "success", description: "Startup updated" });
          router.push(`/startups/${startup.id}`);
        } else {
          const created = await createStartup(payload);
          toast.add({
            type: "success",
            description: "Startup idea created!",
          });
          router.push(`/startups/${created.id}`);
        }
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Startup name"
                  maxLength={160}
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
          name="shortDescription"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Short description <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="One-line summary"
                  maxLength={255}
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
          name="fullDescription"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Full description <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe the problem, solution, vision..."
                  rows={6}
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
          name="industries"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Industries <span className="text-destructive">*</span>
                </FieldLabel>
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
          name="startupStage"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Startup stage</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as string)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STARTUP_STAGE_OPTIONS.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
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
              : isEdit
                ? "Save Changes"
                : "Create Startup Idea"}
          </Button>
        )}
      />
    </form>
  );
}
