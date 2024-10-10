"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

// Debouncing is a powerful technique that helps optimize rendering and performance in React and Next.js applications. Whether you're handling input changes, API calls, or events, understanding and implementing debouncing can significantly enhance user experience and application performance.
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function page() {
  const [username, setUsername] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const { toast } = useToast();

  const router = useRouter();

  // zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
      }
      try {
        const res = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        // remove
        console.log("axios result in signUp: ", res);

        setUsernameMessage(res.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("axios error in signUp: ", axiosError);
        setUsernameMessage(
          axiosError.response?.data.message ??
            "Error checking if the Username unique!.."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    })();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log("data from OnSubmit: ", data);
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(res);
      if (!res.data.success) {
        toast({
          title: "Faild to submit the form",
          description: res.data.message,
        });
      }

      toast({
        title: "Form submitted successfully!!",
        description: res.data.message,
      });
      router.replace("/verify/" + username);
    } catch (error: any) {
      console.error("Error in sing-up form: ", error);
      const axiosError = error as AxiosError<ApiResponse>;

      setUsernameMessage(
        axiosError.response?.data.message ??
          "Error checking if the Username unique!.."
      );
      toast({
        title: "Error in sing-up form",
        description: usernameMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>
        {/* // form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            {/* //form field shadcn */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  <p
                    className={cn(
                      "text-sm",
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-400"
                    )}>
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin size-5" />
                    )}
                    {usernameMessage
                      ? usernameMessage
                      : "Username is unique"}
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-2 animate-spin" />{" "}
                  Loading
                </>
              ) : (
                <>SignUp</>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
