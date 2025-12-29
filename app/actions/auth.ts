"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.users.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/dashboard");
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;

  if (!userId) return redirect("/login?message=authInvalid");

  try {
    const user = await db.users.findUnique({
      where: { id: userId },

      select: {
        id: true,
        username: true,
        email: true,
        role_id: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);

    return null;
  }
}
