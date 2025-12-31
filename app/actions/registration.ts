"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AlertFade } from "@/components/ui/reusable/alert";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (password !== confirmPassword) {
    return { error: "Password Confirmation Does not Match" };
  }

  const user = await db.users.findFirst({
    where: { email },
  });

  // if (user) {
  //   return { error: "Email Already Used" };
  // }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.users.create({
    data: { 
      email,
      password: hashedPassword,
      name: username,
    },
  });

  {
    AlertFade("Account Registered Succesfully");
  }

  redirect("/login?message=registered");
}
