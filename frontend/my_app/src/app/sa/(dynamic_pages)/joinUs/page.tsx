"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import notify from "../../common/useNotification";
import { submitJoinRequest } from "../../utils/auth";
import Link from "next/link";

export default function JoinUsPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleRequested, setRoleRequested] = useState("developer");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fullName || !email || !jobTitle || !experienceYears) {
      notify("Please fill all fields!", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      await submitJoinRequest(fullName, email, roleRequested, jobTitle, experienceYears);
      notify("Your application has been submitted and is pending admin review.", "success");
      setTimeout(() => router.push("/sa/login"), 5000);
    } catch (error: any) {
      console.log("join request error =", error);
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
    <section suppressHydrationWarning className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
      <div className="text-gray-600 text-2xl sm:text-3xl my-3 text-center">
        Join Us as a Professional
      </div>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Developers, Brokers, and Agents must submit an application for admin approval. Once approved, you will receive a registration link via email.
      </p>

      <ToastContainer position="top-center" />

      <form
        noValidate
        suppressHydrationWarning
        onSubmit={handleSubmit}
        className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
      >
        <div className="flex flex-col">
          <label htmlFor="fullName" className="mb-1 text-sm sm:text-base">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            suppressHydrationWarning
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your full name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm sm:text-base">Email</label>
          <input
            id="email"
            name="email"
            suppressHydrationWarning
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="roleRequested" className="mb-1 text-sm sm:text-base">Role Requested</label>
          <select
            id="roleRequested"
            name="roleRequested"
            suppressHydrationWarning
            className="text-gray-600 bg-gray-100 p-2 rounded"
            value={roleRequested}
            onChange={(e) => setRoleRequested(e.target.value)}
          >
            <option value="developer">Developer</option>
            <option value="broker">Broker</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="jobTitle" className="mb-1 text-sm sm:text-base">Job Title</label>
            <input
              id="jobTitle"
              name="jobTitle"
              suppressHydrationWarning
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="E.g., Senior Agent"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="experienceYears" className="mb-1 text-sm sm:text-base">Years of Experience</label>
            <input
              id="experienceYears"
              name="experienceYears"
              suppressHydrationWarning
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="E.g., 5"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>
        </div>

        <button
          disabled={isSubmitting}
          className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200 mt-4 w-full"
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <div className="p-4 text-gray-600 text-sm mt-4 text-center">
        <p>
          Just looking for properties?{" "}
          <Link href="/sa/registerBuyer" className="text-blue-700 hover:underline">
            Register as a Buyer
          </Link>
        </p>
      </div>
    </section>
  );
}
