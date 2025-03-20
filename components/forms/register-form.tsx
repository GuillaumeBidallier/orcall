import { Suspense } from "react";
import RegisterPage from "@/components/RegisterPage";

export default function Register() {
    return (
        <Suspense fallback={<div>Chargement en cours...</div>}>
            <RegisterPage />
        </Suspense>
    );
}
