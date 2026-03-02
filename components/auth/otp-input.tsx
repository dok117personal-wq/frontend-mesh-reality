"use client";

import React, { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split("").slice(0, length));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Update internal state when value prop changes
  useEffect(() => {
    const valueArray = value.split("").slice(0, length);
    setOtp(valueArray.concat(Array(length - valueArray.length).fill("")));
  }, [value, length]);

  // Focus the first empty input or the last input if all filled
  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    
    // Only accept digits
    if (!/^\d*$/.test(newValue)) return;
    
    // Handle paste or multiple characters
    if (newValue.length > 1) {
      // Take only what we need to fill the inputs
      const digits = newValue.split("").slice(0, length - index);
      
      // Create a new OTP array
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });
      
      setOtp(newOtp);
      onChange(newOtp.join(""));
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, length - 1);
      focusInput(nextIndex);
    } else {
      // Handle single character input
      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);
      onChange(newOtp.join(""));
      
      // Auto-focus next input if we entered a digit
      if (newValue && index < length - 1) {
        focusInput(index + 1);
      }
    }
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        // If current input has a value, clear it
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        // If current input is empty, focus previous input
        focusInput(index - 1);
      }
    } 
    // Handle left arrow
    else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } 
    // Handle right arrow
    else if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    
    // Only proceed if paste data contains digits
    if (!/^\d+$/.test(pasteData)) return;
    
    // Take only what we need to fill the inputs
    const digits = pasteData.split("").slice(0, length - index);
    
    // Create a new OTP array
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (index + i < length) {
        newOtp[index + i] = digit;
      }
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(""));
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(index + digits.length, length - 1);
    focusInput(nextIndex);
  };

  // Ref callback function
  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }, (_, i) => (
        <Input
          key={i}
          ref={setRef(i)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={otp[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-medium p-0"
          autoComplete={i === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
}
