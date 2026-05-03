"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { registerUser } from "../../../utils/auth";
import { ToastContainer, toast } from 'react-toastify';
import notify from "../../../common/useNotification"



export default function RegisterPage() {
  const { role } = useParams<{ role: string }>(); // 👈 get role from URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("RegisterPage-role=",role, "token=", token);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [password2, setPassword2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validation (can extract into a helper later)
    if (!firstName || !lastName || !email || !password || !password2) {
      notify("Please fill all fields!", "warning");
      setIsSubmitting(false);
      return;
    }
    if (password !== password2) {
      notify("Passwords do not match!", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser(firstName, lastName, email, password, password2, role, token); // 👈 role dynamic come from useParams(), token from searchParams
      notify(
        "Thanks for signing up. Please check your email — a confirmation link has been sent.",
        "success"
      );
      setTimeout(() => router.push("/sa/login"), 5000);
    } catch (error: any) {
      console.log("registration error =", error);
      Object.entries(error.response?.data || {}).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
        } else {
          notify(`${field}: ${messages}`, "error");
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
      <div className="text-gray-600 text-2xl sm:text-3xl my-3 text-center">
        {role.charAt(0).toUpperCase() + role.slice(1)} Registration
      </div>

      <ToastContainer position="top-center" />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">First Name</label>
            <input
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="Enter your first name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">Last Name</label>
            <input
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="Enter your last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Email</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Password</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Confirm Password</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your password again"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <button
          disabled={isSubmitting}
          className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200"
          type="submit"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="p-4 text-gray-600 text-xl">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
