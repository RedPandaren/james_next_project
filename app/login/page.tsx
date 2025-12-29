"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "dotenv/config";

import { useSearchParams } from "next/navigation";
import { AlertFade } from "@/components/ui/reusable/alert";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "../actions/auth";
import { useEffect, useState } from "react";
import { setLazyProp } from "next/dist/server/api-utils";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const messageParam = searchParams.get("message");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (messageParam === "registered") {
      setSuccess("Account Registered Successfully!");

      // Auto-hide after 2 seconds
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, messageParam]);

  async function handleLoginSubmit(formData: FormData) {
    const result = await loginAction(formData);
    console.log(result?.error);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="border-2 w-2/3 h-full">
        <img
          src="https://www.amitree.com/wp-content/uploads/2021/12/what-is-a-task-tracker-and-why-you-need-one.jpeg"
          className="h-full"
        />
      </div>

      <div className="flex items-center justify-center border w-1/3 h-full">
        {error && AlertFade(error, true)}
        {success && AlertFade(success)}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>

            <CardDescription>
              Enter your Credentials to Login your ACcount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleLoginSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label>Username</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      {/* Forgot your password? */}
                    </a>
                  </div>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
