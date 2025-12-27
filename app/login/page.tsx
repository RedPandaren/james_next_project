"use client";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "../actions/auth";
import { useEffect, useState } from "react";

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

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    console.log(error);
    if (result?.error) {
      if (result?.error) {
        setError(result.error);
      }
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
        {error && (
          <div className="fixed top-4 left-0 right-0 z-00 flex justify-center px-4 pointer-events-none">
            <Alert
              variant="destructive"
              className="w-full max-w-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
            >
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>

            <CardDescription>
              Enter your Credentials to Login your ACcount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit}>
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
            <Button variant="outline" className="w-full">
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
