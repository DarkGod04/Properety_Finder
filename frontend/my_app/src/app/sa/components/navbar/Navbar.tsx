"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../utils/auth";
import { getUnreadCount } from "../../utils/message";

// dynamic navs section
import UserAdminNav from "./UserAdminNav";
import UserBuyerNav from "./UserBuyerNav";
import UserDeveloperNav from "./UserDeveloperNav";
import UserBrokerNav from "./UserBrokerNav";
import UserAgentNav from "./UserAgentNav";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

// Property Dropdown Data
const propertyDropdowns = {
  residential: [
    { label: "Residential for Sale", href: "/sa/residential-properties-for-sale", desc: "Find your dream home" },
    { label: "Residential for Rent", href: "/sa/residential-properties-for-rent", desc: "Rent quality properties" },
  ],
  commercial: [
    { label: "Commercial for Sale", href: "/sa/commercial-properties-for-sale", desc: "Invest in commercial real estate" },
    { label: "Commercial for Rent", href: "/sa/commercial-properties-for-rent", desc: "Office and retail spaces" },
  ],
};

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activePropertyType, setActivePropertyType] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const togglePropertyType = (type: string) => {
    setActivePropertyType((prev) => (prev === type ? null : type));
  };

  const handleLogout = async () => {
    try {
      await logoutUser(setUser);
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Close all menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setActivePropertyType(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setActivePropertyType(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setActiveMenu(null);
        setActivePropertyType(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadCount();
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.log("Navbar-fetchUnreadCount-error=", error);
      }
    };

    fetchUnreadCount();

    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Nav items
  const navItems: NavItem[] = [
    { label: "New Projects", href: "/sa/newProjects" },
    { label: "Find Agent", href: "/sa/findAgent" },
    { label: "Blog", href: "/sa/blog" },
    { label: "About", href: "/sa/about" },
  ];

  // Active link check
  const isActive = (href: string) => {
    if (href === "/sa") return pathname === "/sa";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div ref={menuRef}>
        {/* Desktop Navbar - Enhanced */}
        <header className="hidden md:flex w-full px-6 lg:px-8 py-4 bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-100 items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <Link href="/sa" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/logo-en.svg"
                alt="Property Finder"
                width={130}
                height={48}
                className="object-contain flex-shrink-0"
                priority
              />
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {/* Residential Dropdown */}
              <div className="relative group" onMouseEnter={() => togglePropertyType("residential")} onMouseLeave={() => setActivePropertyType(null)}>
                <button
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePropertyType === "residential" || pathname.includes("residential")
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activePropertyType === "residential"}
                >
                  Residential
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activePropertyType === "residential" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activePropertyType === "residential" && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/5 py-2 z-50 animate-fade-in">
                    {propertyDropdowns.residential.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors group/item"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover/item:text-indigo-600 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Commercial Dropdown */}
              <div className="relative group" onMouseEnter={() => togglePropertyType("commercial")} onMouseLeave={() => setActivePropertyType(null)}>
                <button
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePropertyType === "commercial" || pathname.includes("commercial")
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activePropertyType === "commercial"}
                >
                  Commercial
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activePropertyType === "commercial" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activePropertyType === "commercial" && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/5 py-2 z-50 animate-fade-in">
                    {propertyDropdowns.commercial.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors group/item"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover/item:text-indigo-600 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Nav Items */}
              {navItems.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu("more")}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeMenu === "more"
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === "more"}
                >
                  More
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeMenu === "more" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeMenu === "more" && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/5 py-2 z-50 min-w-[180px] animate-fade-in">
                    <Link href="/sa/explore" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-gray-900 transition-colors">Explore</Link>
                    <Link href="/sa/mortgages" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-gray-900 transition-colors">Mortgages</Link>
                    <Link href="/sa/roleLinks" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-gray-900 transition-colors">Role Links</Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Side - Auth / User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Inbox with badge */}
                <Link
                  href="/sa/inbox"
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                  aria-label={`Inbox, ${unreadCount} unread messages`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Add Property Button */}
                <Link
                  href="/sa/addProperty"
                  className="hidden sm:block px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
                >
                  Add Property
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu("user_nav")}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={activeMenu === "user_nav"}
                  >
                    {user.profile_picture ? (
                      <Image
                        src={`http://127.0.0.1:8000${user.profile_picture}`}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full object-cover ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                    )}
                    <FiChevronDown
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                        activeMenu === "user_nav" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeMenu === "user_nav" && (
                    <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/5 z-50 py-2 min-w-[220px] animate-fade-in">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "buyer" ? "bg-blue-100 text-blue-700" :
                          user.role === "broker" ? "bg-amber-100 text-amber-700" :
                          user.role === "agent" ? "bg-emerald-100 text-emerald-700" :
                          "bg-rose-100 text-rose-700"
                        }`}>
                          {user.role?.charAt(0).toUpperCase()}{user.role?.slice(1)}
                        </span>
                      </div>

                      {/* Dynamic Nav Based on Role */}
                      {user.role === "admin" && <UserAdminNav user={user} />}
                      {user.role === "buyer" && <UserBuyerNav user={user} />}
                      {user.role === "developer" && <UserDeveloperNav user={user} />}
                      {user.role === "broker" && <UserBrokerNav user={user} />}
                      {user.role === "agent" && <UserAgentNav user={user} />}

                      {/* Common Links */}
                      <div className="border-t border-gray-100 pt-2">
                        <Link href="/sa/inbox" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                          <span>Inbox</span>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/sa/login"
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
              >
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Mobile Navbar - Enhanced */}
        <header className="md:hidden w-full bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-100">
          <div className="px-4 py-3">
            {/* Top Row - Logo, Menu Toggle, User */}
            <div className="flex items-center justify-between gap-4">
              <Link href="/sa" className="flex items-center gap-2">
                <Image
                  src="/logo-en.svg"
                  alt="Property Finder"
                  width={100}
                  height={32}
                  className="object-contain flex-shrink-0"
                />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel - Slide Down */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[calc(100vh-60px)]" : "max-h-0"
          }`}>
            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              {/* Property Dropdowns */}
              <div className="space-y-2 mb-4">
                {/* Residential */}
                <div>
                  <button
                    onClick={() => togglePropertyType("residential")}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePropertyType === "residential" || pathname.includes("residential")
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>Residential Properties</span>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activePropertyType === "residential" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activePropertyType === "residential" && (
                    <div className="pl-4 mt-1 space-y-1">
                      {propertyDropdowns.residential.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Commercial */}
                <div>
                  <button
                    onClick={() => togglePropertyType("commercial")}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePropertyType === "commercial" || pathname.includes("commercial")
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>Commercial Properties</span>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activePropertyType === "commercial" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activePropertyType === "commercial" && (
                    <div className="pl-4 mt-1 space-y-1">
                      {propertyDropdowns.commercial.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Other Nav Links */}
              <nav className="flex flex-col gap-1 mb-4" role="navigation" aria-label="Mobile navigation">
                {navItems.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(href)
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-100 mb-4"></div>

              {/* Auth Section */}
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    {user.profile_picture ? (
                      <Image
                        src={`http://127.0.0.1:8000${user.profile_picture}`}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>

                  {/* Inbox */}
                  <Link
                    href="/sa/inbox"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">Inbox</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Add Property */}
                  <Link
                    href="/sa/addProperty"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg justify-center transition-all hover:bg-indigo-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Add Property</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/sa/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg justify-center transition-all hover:bg-indigo-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 7L7 12l4 5m6-10l4 5m0 0l4 5m4-5H7" />
                  </svg>
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Spacers for fixed navbar */}
        <div className="hidden md:block h-[76px]" />
        <div className="md:hidden h-[65px]" />
      </div>
    </>
  );
};

export default Navbar;