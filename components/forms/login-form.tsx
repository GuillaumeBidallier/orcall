"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

// Typage précis de la réponse attendue depuis l'API
interface LoginResponse {
  ok: boolean;
  token?: string;
  user?: any;
  message?: string;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response: LoginResponse = await loginUser({ email, password });

      if (!response.ok || !response.token || !response.user) {
        // Gestion directe sans lever d'erreur inutilement
        toast({
          title: "Erreur de connexion",
          description: response.message || "Erreur lors de la connexion",
          variant: "destructive",
        });
        return; // Important pour sortir de la fonction après avoir affiché l'erreur
      }

      // Si tout est OK, procéder à la connexion
      login(response.token, response.user);
      toast({
        title: "Connexion réussie !",
        description: "Vous êtes connecté.",
      });

    } catch (error: any) {
      // Gestion uniquement des erreurs imprévues (ex : réseau, serveur hors ligne)
      console.error("Erreur inattendue lors de la connexion :", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>
  );
};

export default LoginForm;
