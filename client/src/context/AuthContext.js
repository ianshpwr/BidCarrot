"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/Components/ui/Loader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const logout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setUser(null);
    setError(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          logout();
          setLoading(false);
          return;
        }

        try {
          const storedUser = localStorage.getItem("user_info");
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          } else {
             // If we have token but no user info, we can't fetch it without /me.
             // Best effort: set a basic user object or force logout.
             // For now, let's assume if token is valid we are okay, but we won't have the wallet.
             // A better approach would be to logout to force re-fetch on login.
             // logout(); 
             setUser({ name: "User" });
          }
        } catch (e) {
          console.error("Auth init error", e);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.login({ email, password });
      const { token, user: userData } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        
        // Use the user data from response which now includes wallet
        localStorage.setItem("user_info", JSON.stringify(userData));
        setUser(userData);
        
        router.push("/dashboard");
        return { success: true };
      }
      throw new Error("No token received");
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await auth.signup({ name, email, password });
      return { success: true };
    } catch (err) {
      const message = err.message || "Signup failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // refreshUser is removed or needs to be a no-op if no /me access
  // actually, without /me, we cannot refresh.
  const refreshUser = async () => {
    // Cannot refresh without endpoint
    console.warn("Cannot refresh user without /me endpoint");
  };

  if (loading) return <FullScreenLoader />;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, setError, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
