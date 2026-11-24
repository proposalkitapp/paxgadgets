"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminUser } from "@/types";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email?: string; password?: string; pin?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setIsLoading(false);
          return true;
        }
      }
      setAdminUser(null);
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("[AdminAuthContext] checkSession error:", err);
      setAdminUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/admin/auth", {
          method: "GET",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!isSubscribed) return;

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setAdminUser(data.user);
            setIsLoading(false);
            return;
          }
        }
        setAdminUser(null);
        setIsLoading(false);
      } catch (err) {
        if (!isSubscribed) return;
        console.error("[AdminAuthContext] checkSession error:", err);
        setAdminUser(null);
        setIsLoading(false);
      }
    };

    fetchSession();

    return () => {
      isSubscribed = false;
    };
  }, [pathname]);

  const login = async (credentials: {
    email?: string;
    password?: string;
    pin?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUser(data.user);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || "Authentication failed." };
      }
    } catch {
      setIsLoading(false);
      return { success: false, error: "Network or server connection error." };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/admin/auth", { method: "DELETE" });
      setAdminUser(null);
      setIsLoading(false);
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoading(false);
      router.push("/admin/login");
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        isAuthenticated: !!adminUser,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
