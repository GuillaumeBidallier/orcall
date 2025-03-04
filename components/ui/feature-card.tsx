"use client";

import { DivideIcon as LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  bgColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-orange-500",
  bgColor = "bg-orange-50",
}: FeatureCardProps) {
  return (
    <div
      className={`${bgColor} p-8 rounded-lg text-center transition-transform duration-300 hover:translate-y-[-4px]`}
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-orange-100">
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
