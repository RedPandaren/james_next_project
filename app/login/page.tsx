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

import { useSearchParams } from "next/navigation";
import { AlertFade } from "@/components/ui/reusable/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../actions/auth";
import { useEffect, useState } from "react";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // 1. EFFECT: Handle URL Message Capture & URL Cleanup
  // This runs only ONCE when the component mounts
  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (!messageParam) return;

    if (messageParam === "registered") {
      setSuccess("Account Registered Successfully!");
    } else if (messageParam === "authInvalid") {
      setError("Invalid Session, Please Login to Continue.");
    }

    // Clean URL query params without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.delete("message");
    url.searchParams.delete("error");
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleLoginSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="hidden md:block w-2/3 h-full">
        <img
          src="https://www.amitree.com/wp-content/uploads/2021/12/what-is-a-task-tracker-and-why-you-need-one.jpeg"
          className="h-full w-full object-cover"
          alt="Banner"
        />
      </div>

      <div className="relative flex items-center justify-center w-full md:w-1/3 h-full p-4">
        {/* Floating Alerts */}
        <div className="absolute top-10 left-0 right-0 px-10 flex flex-col gap-2">
          {error && AlertFade(error, true)}
          {success && AlertFade(success)}
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleLoginSubmit}>
              <div className="flex flex-col gap-4">
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-500">Dont have an account?</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
