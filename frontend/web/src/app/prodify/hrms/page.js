import Dashboard from "@/pages/dashboard/Dashboard";
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function page() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}
