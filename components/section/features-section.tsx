"use client";

import { CheckCircle, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/ui/feature-card";

interface FeaturesSectionProps {
  title: string;
  description: string;
  features: {
    icon: any;
    title: string;
    description: string;
  }[];
  tags: { id: string; name: string }[];
  buttonText: string;
  onButtonClick?: () => void;
}

export function FeaturesSection({
  title,
  description,
  features,
  tags,
  buttonText,
  onButtonClick,
}: FeaturesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-3 mb-8">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-4 py-1.5 text-sm border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors duration-300 cursor-pointer"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <Button
            className="px-8 py-6 text-base font-medium bg-orange-500 hover:bg-orange-600 shadow-md transition-all duration-300 group text-white"
            onClick={onButtonClick}
          >
            <span>{buttonText}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}
