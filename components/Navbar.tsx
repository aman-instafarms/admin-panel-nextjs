"use client";

import { Navbar, NavbarBrand, Button } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function AdminNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await auth.signOut();
      Cookies.remove("token");
      router.push("/");
    } catch (err) {
      console.log(err);
      return toast.error("Logout error");
    }
  };

  return (
    <Navbar className="mx-3 mt-3 flex min-h-18 flex-row items-center justify-between">
      <NavbarBrand as={Link} href="/admin">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Jarvis Admin
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">{user.email}</span>
            <Button color="red" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </Navbar>
  );
}
