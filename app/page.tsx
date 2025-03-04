import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/components/hero-section"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
