"use client";

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
import { signup, verifyOtp } from "@/services/auth.service";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/\d/, "At least one number")
    .regex(/[@$!%*?&]/, "At least one special character (@$!%*?&)"),
});
const otpSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const router = useRouter();

  const signupForm = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      try {
        const result = await signup({
          fullName: value.fullName,
          email: value.email,
          password: value.password,
        });
        toast.add({
          type: "success",
          description: result.message,
        });

        setStep("verify");
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });

  const otpForm = useForm({
    defaultValues: {
      code: "",
    },
    validators: { onChange: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        await verifyOtp({
          email: signupForm.state.values.email,
          code: value.code,
        });
        toast.add({
          type: "success",
          description: "Account created successfully.",
        });
        router.push("/login");
      } catch (error) {
        const errorMessage = getApiErrorMessage(error);
        toast.add({
          type: "error",
          description: errorMessage,
        });
      }
    },
  });

  if (step === "verify") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We sent a verification code to{" "}
            <strong>{signupForm.state.values.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            id="otp-form"
            onSubmit={(e) => {
              e.preventDefault();
              otpForm.handleSubmit(e);
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter 6-digit code"
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

            <div className="mt-4 flex flex-col gap-4">
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
                    {isSubmitting ? "Verifying..." : "Verify & Create Account"}
                  </Button>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("signup")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to signup form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Start your co-founder journey today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          id="signup-form"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            signupForm.handleSubmit(e);
          }}
        >
          <FieldGroup>
            <signupForm.Field
              name="fullName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="your full name"
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
          <FieldGroup>
            <signupForm.Field
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
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="your@email.com"
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
          <FieldGroup>
            <signupForm.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="flex flex-col gap-4">
            <signupForm.Subscribe
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
                  {isSubmitting ? "Sending code..." : "Create account"}
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent px-4">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
