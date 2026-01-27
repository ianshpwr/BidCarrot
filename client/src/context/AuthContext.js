"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/Components/ui/Loader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, check if token exists
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Since backend doesn't support /auth/me, we can only infer presence of auth.
        // If we want detailed user info, we'd need to store it in localStorage at login time
        // or decode the JWT if it contains info (it usually only contains ID).
        // For now, checks if we have a token.
        // Optional: decode JWT to verify expiry? 
        // Let's assume valid for now or waiting for a 401 on API call to logout.
        const storedUser = localStorage.getItem("user_info");
        if (storedUser) {
           setUser(JSON.parse(storedUser));
        } else {
           // Fallback if we have token but no user info (legacy session?)
           // Can't really get user info.
           setUser({ name: "User" }); 
        }
      } catch (e) {
        console.error("Auth init error", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      // response.data = { message: "Login successful", token: "..." }
      
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        // HACK: Since GET /login doesn't return user info, we store email locally to show it.
        const userInfo = { email, name: email.split('@')[0] };
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        setUser(userInfo);
        router.push("/dashboard");
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await auth.signup({ name, email, password });
      // response.data = { message: "...", user: {...} }
      // Signup successful, usually redirect to login
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setUser(null);
    router.push("/login");
  };

  if (loading) return <FullScreenLoader />;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
