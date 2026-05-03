"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, TrendingUp, MapPin, Home, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Skyline Residences",
    developer: "Elite Developments",
    location: "Riyadh, Al Aqeeq",
    type: "Residential",
    status: "Under Construction",
    completion: "Q4 2025",
    units: "450 Units",
    image: "https://images.unsplash.com/photo-1545327497-29d5f16a1d4?w=800&q=80",
  },
  {
    id: 2,
    title: "Ocean View Towers",
    developer: "Coastal Properties",
    location: "Jeddah, Al Rawdah",
    type: "Mixed Use",
    status: "Ready to Move",
    completion: "Completed",
    units: "320 Units",
    image: "https://images.unsplash.com/photo-1545327497-29d5f16a1d4?w=800&q=80",
  },
  {
    id: 3,
    title: "Green Valley Compound",
    developer: "Green Living Ltd",
    location: "Dammam, Al Rakah",
    type: "Residential",
    status: "Launching Soon",
    completion: "Q2 2026",
    units: "680 Units",
    image: "https://images.unsplash.com/photo-1600585154527-67da3f1229d?w=800&q=80",
  },
  {
    id: 4,
    title: "Business Hub Tower",
    developer: "Metro Realty",
    location: "Riyadh, King Fahd District",
    type: "Commercial",
    status: "Under Construction",
    completion: "Q3 2025",
    units: "120 Units",
    image: "https://images.unsplash.com/photo-1486406149-4c8fd5f0a1e?w=800&q=80",
  },
];

export default function NewProjectsPage() {
  const [filterType, setFilterType] = useState<"all" | "residential" | "commercial">("all");

  const filteredProjects = filterType === "all"
    ? projects
    : projects.filter(p => p.type.toLowerCase() === filterType);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
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
                  <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">New Projects</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              New Projects
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Discover the latest residential and commercial developments. Find your future home or investment opportunity.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {([
            { key: "all", label: "All Projects", icon: <Building2 className="w-4 h-4" /> },
            { key: "residential", label: "Residential", icon: <Home className="w-4 h-4" /> },
            { key: "commercial", label: "Commercial", icon: <TrendingUp className="w-4 h-4" /> },
          ] as { key: string; label: string; icon: ReactNode }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                filterType === tab.key
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Completed" || project.status === "Ready to Move"
                      ? "bg-green-500 text-white"
                      : project.status === "Under Construction"
                      ? "bg-amber-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{project.developer}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-sm font-semibold text-slate-700">{project.completion}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Units</p>
                    <p className="text-sm font-semibold text-slate-700">{project.units}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Type</p>
                    <p className="text-sm font-semibold text-slate-700">{project.type}</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 group-hover:bg-indigo-700">
                  View Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">No projects found for this filter.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Have a Project to List?</h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Partner with us to showcase your residential or commercial projects to thousands of potential buyers and tenants.
          </p>
          <Link
            href="/sa/register/developer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Register as Developer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
