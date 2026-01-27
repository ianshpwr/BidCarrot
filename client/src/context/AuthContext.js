"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, users } from "@/lib/api";
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
          // Attempt to fetch fresh profile data
          const res = await users.getProfile();
          setUser(res.data);
        } catch (e) {
          console.error("Auth init error - fetching profile failed", e);
          // Fallback to stored info if offline/error, or logout if critical
          const storedUser = localStorage.getItem("user_info");
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          } else {
             // If we can't get profile and have no stored info, but have token, 
             // we might want to logout or just show a basic state.
             // letting it stay logged in with partial info is risky if token is invalid.
             // But valid token + failed profile fetch usually means API issue.
             logout();
          }
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
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        
        // Fetch full profile immediately
        const profileRes = await users.getProfile();
        const fullUser = profileRes.data;
        
        localStorage.setItem("user_info", JSON.stringify(fullUser));
        setUser(fullUser);
        
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

  const refreshUser = async () => {
    try {
      const res = await users.getProfile();
      setUser(res.data);
      localStorage.setItem("user_info", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
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
