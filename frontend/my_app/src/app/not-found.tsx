// app/not-found.tsx
"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
     <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat">
              <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Oops! Page Not Found</h1>
                <p className="text-lg text-gray-600 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/sa"
                  className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                  Go Back Home
                </Link>
              </div>
            </div>
  );
}
