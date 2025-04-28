"use client";

import { Button } from "flowbite-react";
import { app } from "@/utils/firebase";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        // Get the Firebase ID token
        const token = await result.user.getIdToken();

        // Store the token as a session cookie (will expire when browser closes)
        Cookies.set("token", token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        router.push("/admin");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
      {user ? (
        <h4 className="text-xl text-white">
          This account does not have admin access.
        </h4>
      ) : (
        <Button size="xl" disabled={loading} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login with Google"}
        </Button>
      )}
    </main>
  );
}
