"use client";
import Link from "next/link";
import { Code, Building2, Users } from "lucide-react"; // developer, broker, agent

export default function RolesLinksPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#f2f2f2] p-6">
      <div className="max-w-2xl w-full text-center mb-10">
        <h2 className="text-2xl md:text-3xl  text-gray-800">
          Dear Admin,
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Share one of these registration links with people who want to join us.  
          <p className="text-[#ea3934]"> (Only one choice allowed)</p>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Developer */}
        <Link
          href="/sa/register/developer"
          className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition transform duration-200"
        >
          <Code className="w-10 h-10 text-[#ea3934] mb-4" />
          <h3 className="text-lg text-gray-800">
            Join as Developer
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Build and innovate with us
          </p>
        </Link>

        {/* Broker */}
        <Link
          href="/sa/register/broker"
          className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition transform duration-200"
        >
          <Building2 className="w-10 h-10 text-[#ea3934]  mb-4" />
          <h3 className="text-lg text-gray-800">
            Join as Broker
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Connect buyers & sellers
          </p>
        </Link>

        {/* Agent */}
        <Link
          href="/sa/register/agent"
          className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition transform duration-200"
        >
          <Users className="w-10 h-10 text-[#ea3934]  mb-4" />
          <h3 className="text-lg  text-gray-800">
            Join as Agent
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Work under trusted brokers
          </p>
        </Link>
      </div>
    </section>
  );
}
