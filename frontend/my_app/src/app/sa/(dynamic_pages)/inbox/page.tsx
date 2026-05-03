"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "../../components/loading/Loading";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import notify from "../../common/useNotification";

import {
  getReceivedMessages,
  getSentMessages,
  getMessageDetail,
  getUnreadCount,
  Message,
} from "../../utils/message";

type TabType = "received" | "sent" | "detail";

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Role badge colors
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "buyer":
        return "bg-blue-100 text-blue-700";
      case "broker":
        return "bg-amber-100 text-amber-700";
      case "agent":
        return "bg-emerald-100 text-emerald-700";
      case "developer":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "👑";
      case "buyer":
        return "🛒";
      case "broker":
        return "🏢";
      case "agent":
        return "🏠";
      case "developer":
        return "🏗️";
      default:
        return "👤";
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sa/login");
    }
  }, [user, loading, router]);

  // Fetch messages and unread count
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "received") {
        const data = await getReceivedMessages();
        setMessages(data);
      } else if (activeTab === "sent") {
        const data = await getSentMessages();
        setMessages(data);
      }

      // Always update unread count
      const unreadData = await getUnreadCount();
      setUnreadCount(unreadData.unread_count);
    } catch (error: any) {
      notify("Failed to load messages", "error");
      console.log("fetchData-error=", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  // View message detail
  const viewMessage = async (messageId: string) => {
    try {
      const data = await getMessageDetail(messageId);
      setSelectedMessage(data);
      setActiveTab("detail");

      // Refresh unread count
      const unreadData = await getUnreadCount();
      setUnreadCount(unreadData.unread_count);
    } catch (error: any) {
      notify("Failed to load message", "error");
      console.log("viewMessage-error=", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
                  <Link href="/sa/myDashboard" className="ml-1 text-sm font-medium text-slate-600 hover:text-indigo-600 md:ml-2 transition-colors">
                    My Dashboard
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">Inbox</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Inbox</h1>
                  <p className="text-indigo-100 mt-1 text-sm">Manage your messages</p>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <span className="text-white font-semibold">{unreadCount} unread</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-8">
              <button
                onClick={() => setActiveTab("received")}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeTab === "received"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Received
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeTab === "sent"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sent
              </button>
            </div>

            <div className="p-6 md:p-8">
              <ToastContainer position="top-center" autoClose={3000} />

              {/* Messages List */}
              {activeTab !== "detail" && (
                <>
                  {isLoading ? (
                    <div className="text-center py-20">
                      <Loading />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg">No messages yet</p>
                      <p className="text-slate-400 text-sm mt-1">
                        {activeTab === "received" ? "You haven't received any messages yet." : "You haven't sent any messages yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message) => {
                        const isReceived = activeTab === "received";
                        const otherUser = isReceived ? message.sender : message.receiver;

                        return (
                          <div
                            key={message.id}
                            onClick={() => viewMessage(message.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                              !message.is_read && isReceived
                                ? "border-indigo-200 bg-indigo-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* User Avatar */}
                              <div className="flex-shrink-0">
                                {otherUser.profile_picture ? (
                                  <Image
                                    src={`http://127.0.0.1:8000${otherUser.profile_picture}`}
                                    alt={otherUser.first_name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                    {otherUser.first_name?.[0]}{otherUser.last_name?.[0]}
                                  </div>
                                )}
                              </div>

                              {/* Message Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-slate-800">
                                    {otherUser.first_name} {otherUser.last_name}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(otherUser.role)}`}>
                                    {getRoleIcon(otherUser.role)} {otherUser.role}
                                  </span>
                                  {!message.is_read && isReceived && (
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-slate-700 truncate">{message.subject}</p>
                                <p className="text-sm text-slate-500 truncate mt-0.5">{message.body}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                  <span>{new Date(message.created_at).toLocaleDateString()}</span>
                                  <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  {message.property && (
                                    <Link
                                      href={`/sa/property/${message.property.id}`}
                                      className="text-indigo-600 hover:text-indigo-700"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View Property
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Message Detail */}
              {activeTab === "detail" && selectedMessage && (
                <div>
                  <button
                    onClick={() => setActiveTab("received")}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to messages
                  </button>

                  <div className="bg-slate-50 rounded-xl p-6">
                    {/* Sender/Receiver Info */}
                    <div className="flex items-start gap-4 mb-6">
                      {selectedMessage.sender.profile_picture ? (
                        <Image
                          src={`http://127.0.0.1:8000${selectedMessage.sender.profile_picture}`}
                          alt={selectedMessage.sender.first_name}
                          width={56}
                          height={56}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                          {selectedMessage.sender.first_name?.[0]}{selectedMessage.sender.last_name?.[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800">
                          {selectedMessage.sender.first_name} {selectedMessage.sender.last_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(selectedMessage.sender.role)}`}>
                            {getRoleIcon(selectedMessage.sender.role)} {selectedMessage.sender.role}
                          </span>
                          <span className="text-sm text-slate-500">{selectedMessage.sender.email}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-400">
                        {new Date(selectedMessage.created_at).toLocaleDateString()}{" "}
                        {new Date(selectedMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Subject */}
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">{selectedMessage.subject}</h3>

                    {/* Body */}
                    <div className="bg-white rounded-lg p-4 mb-4 whitespace-pre-wrap text-slate-700">
                      {selectedMessage.body}
                    </div>

                    {/* Property Link */}
                    {selectedMessage.property && (
                      <Link
                        href={`/sa/property/${selectedMessage.property.id}`}
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2V10a1 1 0 011-1h3m-6 0a1 1 0 001-1V4a1 1 0 011-1h2a1 1 0 011 1v3m-6 0a1 1 0 001 1v1m0-5a1 1 0 011-1h2a1 1 0 011 1v1M9 9v1m-3 4h.01M15 13h.01" />
                        </svg>
                        View Related Property: {selectedMessage.property.title}
                      </Link>
                    )}

                    {/* Reply Button */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <button
                        onClick={() => {
                          // Navigate to send message with pre-filled receiver
                          router.push(`/sa/send-message?receiver=${selectedMessage.sender.id}&name=${selectedMessage.sender.first_name} ${selectedMessage.sender.last_name}`);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
