"use client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function page() {
  const { data: session, status } = useSession();
  const user: User = session?.user;
  return (
    <div>
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          {session ? (
            <span className="block">
              Wellcome, MR {user.username || user.email}
              <div className="text-lg">Email: {user.email}</div>
            </span>
          ) : (
            <div>
              Pleas Sign In
              <Link href={"/sign-in"} className="underline ml-2">
                here
              </Link>
            </div>
          )}
        </h1>
      </div>
    </div>
  );
}
