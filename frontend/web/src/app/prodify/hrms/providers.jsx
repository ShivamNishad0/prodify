"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

export function HrmsProviders({ children }) {
  return (
    <NextUIProvider locale="en-IN">
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </NextUIProvider>
  );
}
