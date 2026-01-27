"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Card } from "@/Components/ui/Card";
import Link from "next/link";

import { Loader } from "@/Components/ui/Loader";

export default function AuthPage() {
  const { login, signup } = useAuth();
  // ... existing state ...
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[85vh]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Blobs removed for cleaner theme matching landing page */}
      </div>

      <Card className="w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold mb-2 text-center gradient-text">
          {isLogin ? "Welcome Back" : "Join BidCarrot"}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {isLogin ? "Enter your credentials to access your account" : "Start your premium auction journey today"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-white text-black border border-white font-bold hover:bg-gray-200 h-10"
          >
            {loading ? <div className="scale-50 -mt-2"><Loader className="w-8 h-8"/></div> : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </Card>
    </div>
  );
}
