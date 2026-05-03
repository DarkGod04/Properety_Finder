"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Phone, Mail, Star, Verified } from "lucide-react";

interface AgentProfile {
  id: string;
  full_name: string;
  role: string;
  email: string;
  phone_number?: string;
  bio?: string;
}

// Mock data - replace with real API later
const agents: AgentProfile[] = [
  {
    id: "1",
    full_name: "Ahmed Al Rashid",
    role: "agent",
    email: "ahmed@example.com",
    phone_number: "+966500000001",
    bio: "Top-performing agent with 10+ years of experience in Riyadh's luxury property market.",
  },
  {
    id: "2",
    full_name: "Sara Al Mahmoud",
    role: "broker",
    email: "sara@example.com",
    phone_number: "+966500000002",
    bio: "Specializing in commercial properties and investment opportunities across Saudi Arabia.",
  },
  {
    id: "3",
    full_name: "Mohammed Al Qahtani",
    role: "agent",
    email: "mohammed@example.com",
    phone_number: "+966500000003",
    bio: "Residential property expert focused on family homes in the Eastern Province.",
  },
  {
    id: "4",
    full_name: "Nora Al Saud",
    role: "broker",
    email: "nora@example.com",
    phone_number: "+966500000004",
    bio: "Luxury real estate specialist helping clients find premium properties in major cities.",
  },
];

export default function FindAgentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "agent" | "broker">("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.bio && agent.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === "all" || agent.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">Find Agent</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Real Estate Agent
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Connect with trusted agents and brokers to help you buy, sell, or rent properties across Saudi Arabia.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or expertise..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {(["all", "agent", "broker"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    filterRole === role
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-slate-500 mb-6">
          Showing <span className="font-semibold text-slate-700">{filteredAgents.length}</span> {filteredAgents.length === 1 ? "agent" : "agents"}
        </p>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-center relative">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30">
                  {agent.full_name?.charAt(0) || "A"}
                </div>
                <h3 className="text-white font-bold text-lg">{agent.full_name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agent.role === "agent"
                      ? "bg-blue-500/20 text-blue-100"
                      : "bg-amber-500/20 text-amber-100"
                  }`}>
                    {agent.role === "agent" ? "Agent" : "Broker"}
                  </span>
                  <Verified className="w-4 h-4 text-green-400" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {agent.bio && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{agent.bio}</p>
                )}

                <div className="space-y-2 mb-6">
                  {agent.phone_number && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{agent.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{agent.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/sa/send-message?receiver=${agent.id}&name=${encodeURIComponent(agent.full_name)}`}
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm text-center"
                  >
                    Message
                  </Link>
                  {agent.phone_number && (
                    <a
                      href={`tel:${agent.phone_number}`}
                      className="px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">No agents found matching your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setFilterRole("all"); }}
              className="mt-4 px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Are You an Agent or Broker?</h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Join our platform and connect with potential clients looking for properties just like you.
          </p>
          <Link
            href="/sa/register/agent"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 font-semibold transition-colors"
          >
            Join Our Network
            <Star className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
