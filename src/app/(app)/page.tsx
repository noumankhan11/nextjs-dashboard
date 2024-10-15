"use client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import messages from "@../../../messages";
import { Mail } from "lucide-react";

export default function page() {
  const { data: session, status } = useSession();
  const user: User = session?.user;
  return (
    <div>
      <main className="flex-grow flex flex-col items-center h-screen justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* carousel */}
        {/* plugins={[Autoplay({ delay: 2000 })]} */}
        <Carousel className="w-full max-w-lg p-8 text-gray-900 bg-gray-700 border border-gray-400 rounded-lg shadow-md">
          <CarouselContent className="">
            {messages.map((message, index) => (
              <CarouselItem
                key={index}
                className="p-4 transition-transform transform hover:scale-105">
                <Card className="bg-gray-800 border border-gray-200 rounded-lg shadow-lg">
                  <CardHeader className="bg-gray-800 border-b border-gray-200 p-3 rounded-t-lg">
                    <CardTitle className="text-lg font-semibold text-gray-200">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 p-4">
                    <Mail className="flex-shrink-0 text-gray-100" />
                    <div className="flex-1">
                      <p className="text-gray-200">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-300">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </div>
  );
}
