"use client";

import dynamic from "next/dynamic";

// Import dynamique avec rendu uniquement côté client
const HeroSection = dynamic(() => import("@/components/hero-section"), {
    ssr: false,
    loading: () => <div>Chargement...</div>,
});

export default function HeroSectionClient() {
    return <HeroSection />;
}
