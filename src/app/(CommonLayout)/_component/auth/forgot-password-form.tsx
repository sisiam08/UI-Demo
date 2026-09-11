"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from "@/services/auth.service";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only digits"),
});

const resetSchema = z.object({
  newPassword: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/\d/, "At least one number")
    .regex(/[@$!%*?&]/, "At least one special character (@$!%*?&)"),
});

type ResetStep = "email" | "otp" | "reset";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("email");
  const [resetToken, setResetToken] = useState("");

  const emailForm = useForm({
    defaultValues: { email: "" },
    validators: { onChange: emailSchema },
    onSubmit: async ({ value }) => {
      try {
        const result = await requestPasswordReset(value.email);
        toast.add({ type: "success", description: result.message });
        setStep("otp");
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  const otpForm = useForm({
    defaultValues: { code: "" },
    validators: { onChange: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        const result = await verifyPasswordResetOtp({
          email: emailForm.state.values.email,
          code: value.code,
        });
        setResetToken(result.resetToken);
        setStep("reset");
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  const resetForm = useForm({
    defaultValues: { newPassword: "" },
    validators: { onChange: resetSchema },
    onSubmit: async ({ value }) => {
      try {
        const result = await resetPassword({
          token: resetToken,
          newPassword: value.newPassword,
        });
        toast.add({ type: "success", description: result.message });
        router.push("/login");
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  if (step === "otp") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a verification code to{" "}
            <strong>{emailForm.state.values.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="password-reset-otp-form"
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              otpForm.handleSubmit(event);
            }}
          >
            <FieldGroup>
              <otpForm.Field
                name="code"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Verification code
                      </FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Enter 6-digit code"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        autoFocus
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <otpForm.Subscribe
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
                  {isSubmitting ? "Verifying..." : "Verify code"}
                </Button>
              )}
            />
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => setStep("email")}
          >
            <ArrowLeft className="size-4" />
            Back to email
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "reset") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Choose a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="password-reset-form"
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              resetForm.handleSubmit(event);
            }}
          >
            <FieldGroup>
              <resetForm.Field
                name="newPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        required
                        autoFocus
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <resetForm.Subscribe
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
                  {isSubmitting ? "Resetting..." : "Reset password"}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="forgot-password-form"
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            emailForm.handleSubmit(event);
          }}
        >
          <FieldGroup>
            <emailForm.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                      autoFocus
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <emailForm.Subscribe
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
                {isSubmitting ? "Sending..." : "Send verification code"}
              </Button>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent px-4">
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
