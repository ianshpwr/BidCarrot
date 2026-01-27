import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Card } from "@/Components/ui/Card";
import Link from "next/link";
import { Loader } from "@/Components/ui/Loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  // Reset form when switching modes
  useEffect(() => {
    reset();
  }, [isLogin, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(data.email, data.password);
        if (res.success) {
          toast.success("Welcome back!");
        } else {
          toast.error(res.error || "Login failed");
        }
      } else {
        const res = await signup(data.name, data.email, data.password);
        if (res.success) {
          toast.success("Account created! Please login.");
          setIsLogin(true);
          reset();
        } else {
          toast.error(res.error || "Signup failed");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

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
