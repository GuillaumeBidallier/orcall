"use client";
import dynamic from "next/dynamic";

// Charge dynamiquement la Navbar uniquement côté client
const Navbar = dynamic(() => import("@/components/navbar"), {
    ssr: false,
    loading: () => <div>Loading navbar...</div>,
});

// Composant client intermédiaire qui charge la Navbar dynamique
export default function NavbarClient() {
    return <Navbar />;
}
