"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Ne rien afficher s'il n'y a qu'une page

  // Création d'un tableau de numéros de page
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-12">
      {/* Bouton "Précédent" */}
      <Button
        variant="outline"
        className="mx-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Précédent
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          className="mx-1"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Bouton "Suivant" avec l'icône ArrowRight */}
      <Button
        variant="outline"
        className="mx-1"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default Pagination;
