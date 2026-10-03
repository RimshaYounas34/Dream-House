import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  PencilRuler,
  Box,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

import planningImage from "../assets/how-it-works/planning.jpg";
import visualizationImage from "../assets/how-it-works/visualization.jpg";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Start Your Project",
    text: "Enter your plot size and basic requirements to create a clear starting point for your home.",
  },
  {
    number: "02",
    icon: PencilRuler,
    title: "Create Your Plan",
    text: "Arrange rooms, walls, doors and windows in an easy-to-edit 2D floor plan.",
  },
  {
    number: "03",
    icon: Box,
    title: "Explore in 3D",
    text: "Switch from your floor plan to a 3D view and understand your home's space and flow.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Improve with AI",
    text: "Ask the AI assistant for useful suggestions and ideas to improve your house plan.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#f8f5eb] text-[#173d32]">
      <Header />

      <main>
        {/* ================= HERO ================= */}
        <section className="px-6 pb-14 pt-8 sm:px-10 lg:px-16 lg:pb-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="relative overflow-hidden rounded-[30px] bg-[#123d31] px-7 py-12 shadow-[0_20px_60px_rgba(18,61,49,0.15)] sm:px-12 lg:px-16 lg:py-14">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/[0.07]" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/[0.06]" />

              <div className="relative z-10 max-w-[800px]">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-9 bg-[#9ed0bc]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d2c1]">
                    How It Works
                  </p>
                </div>

                <h1 className="font-serif text-[40px] leading-[1.06] tracking-[-0.04em] text-white sm:text-[52px] lg:text-[60px]">
                  From your first idea
                  <span className="block text-[#9fd0bc]">
                    to a complete home plan.
                  </span>
                </h1>

                <p className="mt-6 max-w-[670px] text-[14px] leading-7 text-[#c5d8d1] sm:text-[15px]">
                  DreamHouse Planner makes home planning simple. Start with your
                  requirements, create your floor plan, visualize it in 3D and
                  use AI guidance whenever you need help.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/create-project"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[12px] font-bold text-[#08724f] transition hover:-translate-y-0.5"
                  >
                    Start Planning
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-[12px] font-semibold !text-white backdrop-blur-sm transition hover:bg-white/15"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STEPS ================= */}
        <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-10 max-w-[650px]">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-7 bg-[#08724f]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#08724f]">
                  Simple Process
                </p>
              </div>

              <h2 className="font-serif text-[34px] leading-tight tracking-[-0.03em] text-[#173d32] sm:text-[42px]">
                Four simple steps.
              </h2>

              <p className="mt-3 text-[14px] leading-6 text-[#718079]">
                Everything is designed to keep the planning process clear,
                visual and easy to understand.
              </p>
            </div>

            {/* 4 CARDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="group rounded-[22px] border border-[#dfe6e1] bg-white p-6 shadow-[0_8px_30px_rgba(23,61,50,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cbdad2] hover:shadow-[0_16px_40px_rgba(23,61,50,0.09)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0eb] text-[#08724f] transition group-hover:bg-[#08724f] group-hover:text-white">
                        <Icon size={19} />
                      </div>

                      <span className="font-serif text-[27px] text-[#d8e2dc]">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-[17px] font-bold text-[#24483c]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-[12px] leading-6 text-[#748079]">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= VISUAL SECTION ================= */}
        <section className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[28px] border border-white bg-white p-2.5 shadow-[0_18px_50px_rgba(23,61,50,0.10)]">
              <img
                src={planningImage}
                alt="House planning workspace"
                className="h-[330px] w-full rounded-[22px] object-cover sm:h-[430px]"
              />
            </div>

            <div className="lg:pl-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#08724f]">
                Plan with confidence
              </p>

              <h2 className="mt-3 font-serif text-[35px] leading-tight tracking-[-0.03em] text-[#173d32] sm:text-[44px]">
                See your ideas become a real plan.
              </h2>

              <p className="mt-5 text-[14px] leading-7 text-[#718079]">
                Instead of trying to imagine everything in your head, build your
                home visually. Move rooms, adjust layouts and understand how
                everything connects before you move forward.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Easy-to-edit floor plans",
                  "Clear room and space organization",
                  "Visual 3D understanding",
                  "AI-powered planning guidance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#08724f]"
                    />

                    <span className="text-[12px] font-semibold text-[#52645c]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI SECTION ================= */}
        <section className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 overflow-hidden rounded-[28px] bg-[#e8f0eb] p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
            <div className="overflow-hidden rounded-[22px]">
              <img
                src={visualizationImage}
                alt="Dream home visualization"
                className="h-[280px] w-full object-cover sm:h-[360px]"
              />
            </div>

            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08724f] text-white">
                <Sparkles size={19} />
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#08724f]">
                Smart Assistance
              </p>

              <h2 className="mt-3 font-serif text-[34px] leading-tight tracking-[-0.03em] text-[#173d32] sm:text-[43px]">
                You don't have to plan everything alone.
              </h2>

              <p className="mt-4 max-w-[560px] text-[14px] leading-7 text-[#64746d]">
                When you're unsure about room placement, space usage or your
                overall layout, ask the AI assistant. It can help you explore
                possibilities and make better planning decisions.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <MessageCircle size={18} className="text-[#08724f]" />

                <p className="text-[12px] font-semibold leading-5 text-[#52645c]">
                  Ask questions. Get ideas. Improve your plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 pb-24 pt-10 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="rounded-[28px] bg-[#173d32] px-7 py-10 text-center sm:px-12 sm:py-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9bc7b5]">
                Your next step
              </p>

              <h2 className="mx-auto mt-3 max-w-[700px] font-serif text-[34px] leading-tight text-white sm:text-[43px]">
                Ready to start planning your home?
              </h2>

              <p className="mx-auto mt-4 max-w-[600px] text-[13px] leading-6 text-[#c8d9d2]">
                Create your first project and start turning your ideas into a
                clear, visual house plan.
              </p>

              <Link
                to="/create-project"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[12px] font-bold text-[#08724f] transition hover:-translate-y-0.5"
              >
                Create Your Project
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
