"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Paintbrush,
  LogOut,
  Menu,
  X,
  UserPlus,
  ChevronDown,
  User,
  RefreshCw,
  Search,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { trades } from "@/lib/data";
import UpdateAvailabilityDialog from "./update-availability-dialog";
import Image from "next/image";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { token, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // État local pour ouvrir/fermer le modal de mise à jour du statut
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Récupère le nom du métier correspondant
  const tradeName =
    (user && trades.find((t) => t.id === user.trade)?.name) ||
    (user && user.trade) ||
    "";

  // État pour suivre l'erreur de chargement de l'image
  const [hasError, setHasError] = useState(false);

  // Si une erreur survient, on affiche un div avec les initiales "OC"
  if (hasError) {
    return (
      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-xl font-bold">
        OC
      </div>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/img/orcall-logo.png"
              alt="Logo Orcall"
              width={64}
              height={64}
              onError={() => setHasError(true)}
            />
            <span className="text-2xl font-bold text-orange-500">Orcall</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/service"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/services" ? "text-orange-500" : "text-gray-600"
              }`}
            >
              Services
            </Link>
            <Link
              href="/price"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/tarifs" ? "text-orange-500" : "text-gray-600"
              }`}
            >
              Tarifs
            </Link>
            <Link
              href="/mission"
              className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center ${
                pathname === "/missions" ? "text-orange-500" : "text-gray-600"
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-1" />
              Nos missions
            </Link>
            <Link
              href="/search"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/recherche" ? "text-orange-500" : "text-gray-600"
              }`}
            >
              <Search className="w-4 h-4 inline mr-1" />
              Recherche
            </Link>

            {token && user ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-orange-100 text-orange-800">
                          {user.firstName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col text-left">
                        <span className="text-sm font-medium text-gray-800">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.userType === "entreprise" ? (
                            user.recruitment ? (
                              <span className="text-green-500">
                                Recrutement ouvert
                              </span>
                            ) : (
                              <span className="text-red-500">
                                Recrutement fermé
                              </span>
                            )
                          ) : user.available ? (
                            <span className="text-green-500">Disponible</span>
                          ) : (
                            <span className="text-red-500">Indisponible</span>
                          )}{" "}
                          •
                          {user.userType === "entreprise" ? (
                            <span className="text-gray-500">
                              {" "}
                              {user.companyRole}
                            </span>
                          ) : (
                            <span className="text-gray-500"> {tradeName}</span>
                          )}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-white border border-gray-200 rounded-md shadow-lg p-2 min-w-[200px]"
                  >
                    {/* Mettre à jour mon status */}
                    <DropdownMenuItem
                      onClick={() => setShowUpdateStatus(true)}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Mettre à jour mon status
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />
                    {/* Lien vers Mon Compte */}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <Link href="/account">
                        <>
                          <User className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Mon Compte
                          </span>
                        </>
                      </Link>
                    </DropdownMenuItem>
                    {/* Déconnexion */}
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="default"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Connexion
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Bouton Menu Mobile */}
          <button
            className="p-2 md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="px-4 py-3 space-y-3 bg-white border-b border-gray-200 md:hidden">
            <Link
              href="/service"
              className={`block text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/services" ? "text-orange-500" : "text-gray-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/price"
              className={`block text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/tarifs" ? "text-orange-500" : "text-gray-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            {token && user ? (
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user.images && user.images[0]?.url}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {user.firstName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-gray-500 hover:text-orange-500"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Connexion
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Modal / Dialog de mise à jour du statut */}
      {showUpdateStatus && (
        <UpdateAvailabilityDialog
          isOpen={showUpdateStatus}
          onClose={() => setShowUpdateStatus(false)}
        />
      )}
    </>
  );
};

export default Navbar;
