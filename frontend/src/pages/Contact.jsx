import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Header from "../components/home/Header";

import { apiRequest } from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess(
        response?.message ||
          "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcfa] text-[#17342c]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#e7eeea] bg-[#f4f8f5]">

        {/* Background decoration */}

        <div className="pointer-events-none absolute -left-24 top-[-100px] h-[300px] w-[300px] rounded-full bg-[#dceee6]" />

        <div className="pointer-events-none absolute right-[-90px] top-[-80px] h-[280px] w-[280px] rounded-full bg-[#e5f2ec]" />

        <div className="pointer-events-none absolute bottom-[-100px] left-[45%] h-[230px] w-[230px] rounded-full bg-[#eaf5f0]" />

        <div className="relative mx-auto max-w-[1350px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">

          <div className="mx-auto max-w-[850px] text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe3da] bg-white px-4 py-2 shadow-sm">

              <MessageCircle
                size={14}
                className="text-[#08724f]"
              />

              <span className="text-[11px] font-bold tracking-[0.04em] text-[#426158]">
                WE'RE HERE TO HELP
              </span>

            </div>

            <h1 className="font-serif text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#17342c] sm:text-[58px] lg:text-[66px]">

              Let's talk about

              <span className="block text-[#08724f]">
                your dream home.
              </span>

            </h1>

            <p className="mx-auto mt-6 max-w-[650px] text-[14px] leading-7 text-[#718079] sm:text-[15px]">

              Have a question, need help with your project, or want to
              share feedback? Send us a message and our team will be
              happy to help.

            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT AREA
      ===================================================== */}

      <section className="relative px-6 py-14 sm:px-10 sm:py-20 lg:px-16">

        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.75fr_1.25fr]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="lg:pt-5">

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#08724f]">
              Contact Support
            </p>

            <h2 className="mt-3 font-serif text-[34px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#17342c] sm:text-[40px]">

              We're listening.

            </h2>

            <p className="mt-5 max-w-[410px] text-[13px] leading-7 text-[#718079]">

              Tell us what you need help with. Whether it's your floor
              plan, AI planner, 3D view, account, or anything else,
              we're here to help.

            </p>

            {/* CONTACT INFO */}

            <div className="mt-8 space-y-3">

              {/* Email */}

              <div className="flex items-center gap-4 rounded-2xl border border-[#e0e9e4] bg-white p-4 shadow-[0_8px_25px_rgba(23,52,44,0.04)]">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f3ed] text-[#08724f]">
                  <Mail size={18} />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a19b]">
                    Email
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[#29463d]">
                    Send us your query
                  </p>

                </div>

              </div>

              {/* Support */}

              <div className="flex items-center gap-4 rounded-2xl border border-[#e0e9e4] bg-white p-4 shadow-[0_8px_25px_rgba(23,52,44,0.04)]">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f3ed] text-[#08724f]">
                  <Clock3 size={18} />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a19b]">
                    Support
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[#29463d]">
                    We're ready to help
                  </p>

                </div>

              </div>

              {/* Location */}

              <div className="flex items-center gap-4 rounded-2xl border border-[#e0e9e4] bg-white p-4 shadow-[0_8px_25px_rgba(23,52,44,0.04)]">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f3ed] text-[#08724f]">
                  <MapPin size={18} />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a19b]">
                    Dream House Planner
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[#29463d]">
                    Design smarter. Build better.
                  </p>

                </div>

              </div>

            </div>

            {/* SMALL CTA */}

            <div className="mt-6 rounded-2xl bg-[#08724f] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Sparkles size={17} />
                </div>

                <div>

                  <p className="text-[12px] font-bold text-white">
                    Have a project question?
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/70">
                    Tell us about it using the form and we'll take a
                    look.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <div className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-[0_20px_60px_rgba(23,52,44,0.07)] sm:p-8">

            {/* FORM HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-[#08724f]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08724f]">
                    Send a Message
                  </p>

                </div>

                <h3 className="mt-2 text-[23px] font-bold tracking-[-0.02em] text-[#17342c]">
                  How can we help?
                </h3>

              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#e6f3ed] text-[#08724f] sm:flex">
                <Send size={18} />
              </div>

            </div>

            <div className="my-6 h-px bg-[#edf1ee]" />

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#b9dfcf] bg-[#effaf5] p-4">

                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-[#08724f]"
                />

                <div>

                  <p className="text-[12px] font-bold text-[#08724f]">
                    Message sent successfully
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#557067]">
                    {success}
                  </p>

                </div>

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                <X
                  size={19}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>

                  <p className="text-[12px] font-bold text-red-700">
                    Unable to send message
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME + EMAIL */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-[11px] font-bold text-[#53675f]"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    maxLength={120}
                    className="h-[50px] w-full rounded-xl border border-[#dce6e1] bg-[#fafcfb] px-4 text-[13px] text-[#29463d] outline-none transition placeholder:text-[#a3ada8] focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/10"
                  />

                </div>

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-bold text-[#53675f]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    maxLength={160}
                    className="h-[50px] w-full rounded-xl border border-[#dce6e1] bg-[#fafcfb] px-4 text-[13px] text-[#29463d] outline-none transition placeholder:text-[#a3ada8] focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/10"
                  />

                </div>

              </div>

              {/* SUBJECT */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block text-[11px] font-bold text-[#53675f]"
                >
                  What can we help with?
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="h-[50px] w-full rounded-xl border border-[#dce6e1] bg-[#fafcfb] px-4 text-[13px] text-[#53675f] outline-none transition focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/10"
                >

                  <option value="">
                    Select a topic
                  </option>

                  <option value="Floor Plan Help">
                    Floor Plan Help
                  </option>

                  <option value="3D View">
                    3D View
                  </option>

                  <option value="AI Planner">
                    AI Planner
                  </option>

                  <option value="Account & Login">
                    Account & Login
                  </option>

                  <option value="Project Help">
                    Project Help
                  </option>

                  <option value="Technical Issue">
                    Technical Issue
                  </option>

                  <option value="General Query">
                    General Query
                  </option>

                  <option value="Feedback">
                    Feedback
                  </option>

                </select>

              </div>

              {/* MESSAGE */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="message"
                    className="block text-[11px] font-bold text-[#53675f]"
                  >
                    Your Message
                  </label>

                  <span className="text-[10px] text-[#9ba6a1]">
                    {form.message.length}/3000
                  </span>

                </div>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your question or issue..."
                  required
                  maxLength={3000}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-[#dce6e1] bg-[#fafcfb] px-4 py-3.5 text-[13px] leading-6 text-[#29463d] outline-none transition placeholder:text-[#a3ada8] focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/10"
                />

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[#08724f] text-[13px] font-bold text-white shadow-[0_12px_25px_rgba(8,114,79,0.17)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#065d40] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

              <p className="text-center text-[10px] leading-5 text-[#98a49f]">
                Your message will be securely sent to Dream House
                Planner support.
              </p>

            </form>

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="border-t border-[#e7eeea] bg-white px-6 py-10 sm:px-10">

        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-5 sm:flex-row">

          <div className="text-center sm:text-left">

            <p className="text-[14px] font-bold text-[#29463d]">
              Ready to start designing?
            </p>

            <p className="mt-1 text-[11px] text-[#7b8982]">
              Create your floor plan and bring your idea to life.
            </p>

          </div>

          <Link
            to="/design-method"
            className="group inline-flex items-center gap-2 rounded-full bg-[#08724f] px-6 py-3 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(8,114,79,0.15)] transition hover:-translate-y-0.5 hover:bg-[#065d40]"
          >
            Start Planning

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />

          </Link>

        </div>

      </section>

    </div>
  );
}