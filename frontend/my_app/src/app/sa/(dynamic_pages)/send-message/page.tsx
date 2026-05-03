"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";
import { sendMessage } from "../../utils/message";
import notify from "../../common/useNotification";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

export default function SendMessagePage() {
  return (
    <Suspense
      fallback={
        <div className="text-center mt-20">
          <Loading />
        </div>
      }
    >
      <SendMessageContent />
    </Suspense>
  );
}

function SendMessageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const receiverId = searchParams.get("receiver");
  const receiverName = searchParams.get("name") || "User";
  const propertyId = searchParams.get("property") || "";
  const propertyTitle = searchParams.get("title") || "";

  const [subject, setSubject] = useState(propertyTitle ? `Re: ${propertyTitle}` : "");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sa/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) {
      notify("Please fill in all fields", "warning");
      return;
    }

    if (!receiverId) {
      notify("Receiver not specified", "error");
      return;
    }

    setIsSending(true);
    try {
      const data: any = {
        receiver_id: receiverId,
        subject: subject.trim(),
        body: body.trim(),
      };

      if (propertyId) {
        data.property_id = propertyId;
      }

      await sendMessage(data);
      notify("Message sent successfully!", "success");

      // Redirect to inbox after a short delay
      setTimeout(() => {
        router.push("/sa/inbox");
      }, 1500);
    } catch (error: any) {
      notify("Failed to send message", "error");
      console.log("sendMessage-error=", error);
    } finally {
      setIsSending(false);
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
        <div className="max-w-2xl mx-auto">
          {/* Header with Breadcrumb */}
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
                  <Link href="/sa/inbox" className="ml-1 text-sm font-medium text-slate-600 hover:text-indigo-600 md:ml-2 transition-colors">
                    Inbox
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">Send Message</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-8 py-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Send Message</h1>
              <p className="text-indigo-100 mt-1 text-sm">Send a message to {receiverName}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <ToastContainer position="top-center" autoClose={3000} />

              {/* Receiver Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Sending to:</p>
                <p className="font-semibold text-slate-800 mt-1">{receiverName}</p>
              </div>

              {/* Property Context */}
              {propertyTitle && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Regarding property:</p>
                  <Link
                    href={`/sa/property/${propertyId}`}
                    className="font-semibold text-indigo-700 hover:text-indigo-800 mt-1 inline-block"
                  >
                    {propertyTitle}
                  </Link>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                  placeholder="Enter message subject"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400 resize-y min-h-[200px]"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? "Sending..." : "Send Message"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
