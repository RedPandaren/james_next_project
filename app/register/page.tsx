"use client";
import { ComponentExample } from "@/components/component-example";

import { Button } from "@/components/ui/button";
import { AlertFade } from "@/components/ui/reusable/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useEffect, useState } from "react";
import { registerAction } from "../actions/registration";

export default function Page() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  async function handleRegisterSubmit(formData: FormData) {
    const result = await registerAction(formData);
    console.log(error);
    if (result?.error) {
      if (result?.error) {
        setError(result.error);
      }
    }
  }
  return (
    <div className="flex justify-center h-screen">
      <div className="absolute inset-0 -z-10">
        {error && AlertFade(error, true)}
        <img
          src="https://www.amitree.com/wp-content/uploads/2021/12/what-is-a-task-tracker-and-why-you-need-one.jpeg"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="flex items-center justify-center w-1/3 h-full">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Account Registration</CardTitle>

            <CardDescription>Create an Account with Us!</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleRegisterSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Username</Label>
                  <Input
                    name="username"
                    id="username"
                    placeholder="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Have an Account?
                    </a>
                  </div>
                  <Input
                    name="confirm_password"
                    id="confirm_password"
                    type="password"
                    placeholder="confirm password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
  return <ComponentExample />;
}
