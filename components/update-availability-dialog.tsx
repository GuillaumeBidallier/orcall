"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";
import { BACKEND_URL } from "@/lib/api";

interface UpdateAvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateAvailabilityDialog: React.FC<UpdateAvailabilityDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, token, refreshUser } = useAuth();

  // Si l'utilisateur est une entreprise, on utilise le champ "recruitment" ; sinon, "available"
  const [localStatus, setLocalStatus] = useState<boolean>(
    user.userType === "entreprise" ? user.recruitment : user.available,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!user || !token) return;
    setIsSubmitting(true);
    try {
      // Créez le payload en fonction du type d'utilisateur
      const payload =
        user.userType === "entreprise"
          ? { recruitment: localStatus }
          : { available: localStatus };

      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
         new Error(
          data.message || "Erreur lors de la mise à jour du statut",
        );
      }
      // Rafraîchir les infos utilisateur
      refreshUser && refreshUser();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mise à jour du statut</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between p-4 border rounded-md">
          <span className="text-sm font-medium text-gray-800">
            {user.userType === "entreprise"
              ? `Recrutement ${localStatus ? "ouvert" : "fermé"}`
              : `Actuellement ${localStatus ? "Disponible" : "Indisponible"}`}
          </span>
          <Switch
            checked={localStatus}
            onCheckedChange={(val) => setLocalStatus(val)}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAvailabilityDialog;
