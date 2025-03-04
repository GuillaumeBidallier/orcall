"use client";

import React from "react";
import AccountForm from "@/components/forms/account-form";
import { useAuth } from "@/context/auth-context";

const MonComptePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <AccountForm />
    </div>
  );
};

export default MonComptePage;
