"use client";

import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function CTASection({
  title,
  description,
  buttonText,
  onButtonClick,
}: CTASectionProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <p className="text-xl mb-8 text-white/90">{description}</p>
          <Button
            variant="secondary"
            className="px-8 py-6 text-base font-medium bg-white text-orange-600 hover:bg-gray-100 shadow-md transition-all duration-300"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
