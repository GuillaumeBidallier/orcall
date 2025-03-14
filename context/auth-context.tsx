"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode, useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  refreshUser: () => void;
}


const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (token && user?.id) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          logout();
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.error(
              "Erreur lors de la récupération de l'utilisateur",
              data.message,
          );
        }
      } catch (error) {
        console.error(
            "Erreur lors du rafraîchissement des données utilisateur",
            error,
        );
      }
    }
  }, [token, user?.id, logout]);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur", error);
      }
    }
  }, []);

// Rafraîchir les données utilisateur dès que refreshUser change (dépendances internes incluses)
  useEffect(() => {
    refreshUser().then((r) => r);
  }, [refreshUser]);

  const login = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    router.push("/");
  };



  return (
    <AuthContext.Provider value={{ token, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
