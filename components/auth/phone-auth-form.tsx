"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePhoneAuth } from "@/hooks/use-phone-auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OtpInput } from "./otp-input";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .transform(val => {
      // Remove all non-digit characters
      const digits = val.replace(/\D/g, '');
      // Add +1 prefix if not present
      return digits.length === 10 ? `+1${digits}` : digits.startsWith('1') ? `+${digits}` : digits;
    })
    .refine(val => {
      // Should be +1 followed by 10 digits
      return /^\+1\d{10}$/.test(val);
    }, "Please enter a valid US phone number"),
});

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must only contain numbers"),
});

export function PhoneAuthForm() {
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const { loading, error, sendVerificationCode, verifyCode } = usePhoneAuth();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
    mode: "onSubmit", // Only validate on submit
  });

  const verificationForm = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit", // Only validate on submit
  });

  // Countdown timer for resend code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === "verification" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  const onPhoneSubmit = async (data: { phoneNumber: string }) => {
    try {
      console.log("Sending code to:", data.phoneNumber);
      await sendVerificationCode(data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setStep("verification");
      setCountdown(60);
      setCanResend(false);
      toast.success("Verification code sent!");
    } catch (err) {
      console.error("Error sending verification code:", err);
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const onVerificationSubmit = async (data: { code: string }) => {
    try {
      console.log("Verifying code:", data.code);
      await verifyCode(data.code);
      // Removed success toast as requested
    } catch (err) {
      console.error("Error verifying code:", err);
      toast.error("Invalid verification code. Please try again.");
      verificationForm.reset();
    }
  };

  const handleResendCode = async () => {
    if (!canResend || loading) return;
    
    try {
      await sendVerificationCode(phoneNumber);
      setCountdown(60);
      setCanResend(false);
      toast.success("Verification code resent!");
    } catch (err) {
      console.error("Error resending verification code:", err);
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleOtpChange = (value: string) => {
    // Just update the value without validation
    verificationForm.setValue("code", value, { 
      shouldValidate: false // Don't validate on change
    });
    
    // Auto-submit only when all 6 digits are entered
    if (value.length === 6) {
      verificationForm.handleSubmit(onVerificationSubmit)();
    }
  };

  return (
    <div className="grid gap-4">
      {error && (
        <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="animate-in fade-in-50">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  +1
                </span>
                <Input
                  {...phoneForm.register("phoneNumber", {
                    onChange: (e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      e.target.value = formatted;
                    }
                  })}
                  placeholder="(555) 000-0000"
                  type="tel"
                  autoCapitalize="none"
                  autoComplete="tel"
                  autoCorrect="off"
                  disabled={loading}
                  className="pl-8"
                />
              </div>
              {phoneForm.formState.errors.phoneNumber && phoneForm.formState.submitCount > 0 && (
                <p className="text-sm text-red-500">
                  {phoneForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
            <Button disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Code
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="animate-in fade-in-50">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to your phone
              </p>
              <OtpInput
                value={verificationForm.watch("code")}
                onChange={handleOtpChange}
                disabled={loading}
              />
              {verificationForm.formState.errors.code && verificationForm.formState.submitCount > 0 && (
                <p className="text-sm text-red-500 text-center">
                  {verificationForm.formState.errors.code.message}
                </p>
              )}
              <div className="text-center mt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm text-primary hover:underline focus:outline-none"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend code in <span className="font-medium">{countdown}s</span>
                  </p>
                )}
              </div>
            </div>
            <Button disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("phone");
                verificationForm.reset();
              }}
              disabled={loading}
              className="w-full"
            >
              Back to Phone Number
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
