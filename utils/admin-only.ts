import "server-only";
import { cookies } from "next/headers";
import { db } from "@/drizzle/db";
import { admins } from "@/drizzle/schema";
import { getAuth } from "firebase-admin/auth";
import { eq } from "drizzle-orm";
import { initFirebaseAdmin } from "./firebase-admin";

export async function isAdmin() {
  // Get the auth token from the cookies
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    throw new Error("You are not logged in.");
  }

  try {
    // Verify the token with Firebase
    const decodedToken =
      await getAuth(initFirebaseAdmin()).verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      throw new Error("Please login again.");
    }

    // Check if user exists in admin table
    const adminUser = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));

    if (!adminUser || adminUser.length === 0) {
      throw new Error("This account does not have admin access.");
    }

    // If we get here, the user is authenticated and is an admin
    return true;
  } catch (error) {
    // If there's any error in token verification or db query, redirect to home
    console.error("Auth error:", JSON.stringify(error));
    throw new Error("Login Expired. Please logout and login again.");
  }
}
