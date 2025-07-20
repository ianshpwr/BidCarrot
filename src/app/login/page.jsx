"use client";

import { useEffect, useState } from "react";
import supabase from "@/Components/Supabase/Client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Ensure this runs only on client
    setRedirectTo(`${window.location.origin}/dashboard`);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md w-full">
        {redirectTo && (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#000",
                    accent: "#000",
                    error: "#FF0000",
                    background: "#fff",
                    text: "#000",
                  },
                },
              },
              styles: {
                container: {
                  padding: "1rem",
                },
              },
            }}
            theme="light"
            providers={["google"]}
            socialLayout="vertical"
            redirectTo={redirectTo}
            magicLink={true}
            showLinks={true}
          />
        )}
      </div>
    </div>
  );
}
