"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Définition de l'interface des critères (vous pouvez réutiliser celle déjà définie)
export interface RatingCriteria {
  id: string;
  name: string;
  value: number;
}

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  ratingCriteria: RatingCriteria[];
  updateCriteriaRating: (criteriaId: string, value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  calculateAverageRating: () => number;
  isSubmitting: boolean;
  targetUser: {
    firstName: string;
    lastName: string;
  };
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  ratingCriteria,
  updateCriteriaRating,
  comment,
  setComment,
  calculateAverageRating,
  isSubmitting,
  targetUser,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Évaluer {targetUser.firstName} {targetUser.lastName}
          </DialogTitle>
          <DialogDescription>
            Partagez votre expérience en notant les différents aspects de la
            prestation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {ratingCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={criteria.id} className="font-medium">
                  {criteria.name}
                </Label>
                <span className="text-sm text-gray-500">
                  {criteria.value}/5
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateCriteriaRating(criteria.id, star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        criteria.value >= star
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="comment" className="font-medium">
              Commentaire
            </Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce professionnel..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Note moyenne</span>
              <div className="flex items-center">
                <span className="font-bold text-lg mr-1">
                  {calculateAverageRating().toFixed(1)}
                </span>
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer l'évaluation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
