"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, Phone, Mail, MapPin, Globe, Shield, FileText,
  ChevronRight, CheckCircle, Users, TrendingUp
} from "lucide-react";

type AboutSection = "about" | "contact" | "terms" | "privacy" | "refund";

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutContent />
    </Suspense>
  );
}

function AboutContent() {
  const [activeSection, setActiveSection] = useState<AboutSection>("about");
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section") as AboutSection | null;
    if (section && ["about", "contact", "terms", "privacy", "refund"].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

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
                <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">About Us</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Property Finder
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Your trusted platform for finding residential and commercial properties across Saudi Arabia.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-8">
              {([
                { key: "about" as AboutSection, label: "About Us", icon: <Building2 className="w-4 h-4" /> },
                { key: "contact" as AboutSection, label: "Contact Us", icon: <Phone className="w-4 h-4" /> },
                { key: "terms" as AboutSection, label: "Terms of Service", icon: <FileText className="w-4 h-4" /> },
                { key: "privacy" as AboutSection, label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
                { key: "refund" as AboutSection, label: "Refund Policy", icon: <CheckCircle className="w-4 h-4" /> },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.key
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${
                    activeSection === item.key ? "rotate-90" : ""
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">

              {/* About Us */}
              {activeSection === "about" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">About Property Finder</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Our Mission</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Property Finder is Saudi Arabia&apos;s premier real estate platform, dedicated to connecting
                        buyers, sellers, landlords, and tenants with the perfect properties. Whether you&apos;re looking for
                        a residential home, a commercial space, or an investment opportunity, we make the process
                        seamless and transparent.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">What We Offer</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { icon: <Building2 className="w-6 h-6 text-indigo-600" />, title: "Residential Properties", desc: "Apartments, villas, compounds, and more for sale or rent." },
                          { icon: <TrendingUp className="w-6 h-6 text-indigo-600" />, title: "Commercial Properties", desc: "Offices, retail spaces, warehouses, and investment opportunities." },
                          { icon: <Users className="w-6 h-6 text-indigo-600" />, title: "Verified Agents", desc: "Connect with trusted real estate agents and brokers." },
                          { icon: <CheckCircle className="w-6 h-6 text-indigo-600" />, title: "Secure Messaging", desc: "Communicate directly with property owners within our platform." },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-4">
                            <div className="mb-2">{item.icon}</div>
                            <h4 className="font-semibold text-slate-700 mb-1">{item.title}</h4>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Our Commitment</h3>
                      <p className="text-slate-600 leading-relaxed">
                        We are committed to providing accurate, up-to-date property listings and maintaining
                        the highest standards of professionalism. Our platform serves buyers, sellers, landlords,
                        tenants, agents, brokers, developers, and administrators across the Kingdom.
                      </p>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">Business Information</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-600"><span className="font-medium">Business Name:</span> Property Finder Ltd.</p>
                        <p className="text-slate-600"><span className="font-medium">Registration:</span> Licensed Real Estate Platform</p>
                        <p className="text-slate-600"><span className="font-medium">Coverage:</span> Kingdom of Saudi Arabia</p>
                        <p className="text-slate-600"><span className="font-medium">Operating Since:</span> 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Us */}
              {activeSection === "contact" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Us</h2>

                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">Phone Support</h3>
                      <p className="text-slate-600 mb-1">+966 123 456 789</p>
                      <p className="text-xs text-slate-400">Sunday - Thursday, 9 AM - 6 PM</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">Email Support</h3>
                      <p className="text-slate-600 mb-1">support@propertyfinder.sa</p>
                      <p className="text-xs text-slate-400">We respond within 24 hours</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">Office Location</h3>
                      <p className="text-slate-600 mb-1">Riyadh, Kingdom of Saudi Arabia</p>
                      <p className="text-xs text-slate-400">By appointment only</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <Globe className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">Website</h3>
                      <p className="text-slate-600 mb-1">www.propertyfinder.sa</p>
                      <p className="text-xs text-slate-400">24/7 online access</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-700 mb-4">Send Us a Message</h3>
                    <Link
                      href="/sa/inbox"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Go to Inbox
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Terms of Service */}
              {activeSection === "terms" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Terms of Service</h2>
                  <div className="space-y-6 text-slate-600">
                    <p className="text-sm text-slate-400">Last updated: April 27, 2026</p>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Acceptance of Terms</h3>
                      <p className="leading-relaxed">
                        By accessing and using Property Finder, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">2. User Accounts</h3>
                      <p className="leading-relaxed">
                        You must register an account to access certain features. You are responsible for maintaining
                        the confidentiality of your account credentials and for all activities under your account.
                        You must provide accurate information during registration (name, email, role).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">3. User Roles & Responsibilities</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Buyers:</strong> Can browse properties, save favorites, and message property owners.</li>
                        <li><strong>Agents/Brokers:</strong> Can list properties and communicate with potential buyers/tenants.</li>
                        <li><strong>Developers:</strong> Can showcase projects and manage property listings.</li>
                        <li><strong>Admins:</strong> Have full platform management capabilities.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">4. Property Listings</h3>
                      <p className="leading-relaxed">
                        All property listings must be accurate and truthful. Users are prohibited from posting
                        fraudulent, misleading, or illegal content. We reserve the right to remove any listing
                        that violates our policies.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">5. Prohibited Activities</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Posting false or misleading property information</li>
                        <li>Using the platform for illegal purposes</li>
                        <li>Attempting to circumvent our messaging system to avoid fees</li>
                        <li>Scraping data or reverse-engineering our platform</li>
                        <li>Harassing or abusing other users</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">6. Limitation of Liability</h3>
                      <p className="leading-relaxed">
                        Property Finder acts as a platform connecting users and does not guarantee the accuracy
                        of listings. We are not liable for any disputes between users. All transactions and
                        agreements are solely between the involved parties.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Policy */}
              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Privacy Policy</h2>
                  <div className="space-y-6 text-slate-600">
                    <p className="text-sm text-slate-400">Last updated: April 27, 2026</p>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Information We Collect</h3>
                      <p className="leading-relaxed mb-3">We collect the following information:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Information:</strong> Name, email, phone number, role (buyer, agent, broker, developer, admin).</li>
                        <li><strong>Profile Information:</strong> Profile picture, bio, company details (for agents/developers).</li>
                        <li><strong>Property Data:</strong> Listings you create, including location, price, and specifications.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">2. How We Use Your Information</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>To provide and maintain our service</li>
                        <li>To notify you about property inquiries and messages</li>
                        <li>To improve our platform and user experience</li>
                        <li>To comply with legal obligations</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">3. Information Sharing</h3>
                      <p className="leading-relaxed">
                        We do not sell your personal information. We share data only when necessary to provide
                        our service (e.g., showing your contact info to interested buyers), or when required by law.
                        Messages between users are private and encrypted.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">4. Data Security</h3>
                      <p className="leading-relaxed">
                        We implement industry-standard security measures including HTTPS encryption, secure
                        HTTP-only cookies for authentication, and password hashing. However, no method of
                        transmission over the internet is 100% secure.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">5. Your Rights</h3>
                      <p className="leading-relaxed">
                        You have the right to access, update, or delete your personal information.
                        You can do this by logging into your account and editing your profile,
                        or by contacting our support team.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">6. Cookies</h3>
                      <p className="leading-relaxed">
                        We use cookies to maintain your session and remember your preferences.
                        You can control cookie settings through your browser preferences.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Policy */}
              {activeSection === "refund" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Refund Policy</h2>
                  <div className="space-y-6 text-slate-600">

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800">Important Notice</h3>
                      </div>
                      <p className="text-amber-700">
                        Property Finder is currently a free platform. There are no subscription fees
                        or charges for listing properties. This policy will be updated if paid services are introduced.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Free Services</h3>
                      <p className="leading-relaxed">
                        All current platform features including property listings, search, favorites,
                        and in-app messaging are provided free of charge.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">2. Future Paid Services</h3>
                      <p className="leading-relaxed">
                        If premium features or advertising packages are introduced in the future,
                        they will be clearly marked and subject to a separate refund policy.
                        Users will be notified in advance of any changes to our pricing model.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">3. Contact for Billing Issues</h3>
                      <p className="leading-relaxed">
                        For any billing-related questions or concerns, please contact our support team
                        at support@propertyfinder.sa or through our inbox messaging system.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Property?</h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Join thousands of users who trust Property Finder for their real estate needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/sa/register/buyer"
              className="px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/sa/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
