"use client";

import React from "react";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/forms/login-form"), {
  ssr: false,
});

const LoginPage: React.FC = () => {
  return (
    <div className="relative h-[calc(100vh-4.05rem)] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 container mx-auto px-4 h-full">
        <div className="flex flex-col md:flex-row items-center justify-center h-full overflow-hidden">
          {/* Volet marketing pour desktop/tablet */}
          <div className="hidden md:flex md:w-1/2 flex-col items-start justify-center pr-8 text-white">
            <h1 className="text-5xl font-extrabold mb-6">
              Bienvenue sur Orcall
            </h1>
            <p className="text-xl mb-4">
              Accédez à un réseau exclusif de professionnels qualifiés et
              découvrez des offres sur mesure pour vos projets.
            </p>
            <ul className="list-disc ml-6">
              <li className="mb-2">Profils vérifiés et avis clients</li>
              <li className="mb-2">Offres exclusives et remises spéciales</li>
              <li className="mb-2">Assistance 24/7</li>
            </ul>
          </div>
          {/* Volet connexion */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
              <h1 className="mb-4 text-4xl font-extrabold text-center text-gray-900">
                Connexion
              </h1>
              <p className="mb-8 text-center text-lg text-gray-700">
                Accédez à votre compte et découvrez toutes nos offres et
                services.
              </p>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Vous n'avez pas encore de compte ?{" "}
                  <a
                    href="/inscription"
                    className="text-orange-500 hover:underline"
                  >
                    Inscrivez-vous gratuitement
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
