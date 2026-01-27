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
    const initAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Robust check: Validate expiry
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
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        const userInfo = { email, name: email.split('@')[0] };
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        setUser(userInfo);
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
      // Usually generic success, user still needs to login or we auto-login
      return { success: true };
    } catch (err) {
      const message = err.message || "Signup failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
