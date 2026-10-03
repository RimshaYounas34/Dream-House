import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ruler,
  Box,
  Sparkles,
  Save,
  Smartphone,
  LayoutTemplate,
  Download,
  PencilRuler,
  Check,
  MessageCircle,
} from "lucide-react";

import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

import floorPlanImage from "../assets/features/floor-plan.jpg";
import threeDImage from "../assets/features/3d-view.jpg";
import aiPlannerImage from "../assets/features/ai-planner.jpg";
import measurementsImage from "../assets/features/measurements.jpg";
import saveProjectImage from "../assets/features/save-project.jpg";
import responsiveImage from "../assets/features/responsive.jpg";
import templatesImage from "../assets/features/templates.jpg";
import exportImage from "../assets/features/export.jpg";

const features = [
  {
    number: "01",
    icon: PencilRuler,
    title: "2D Floor Planning",
    description:
      "Create and edit your home's floor plan with rooms, walls, doors and windows in a clear 2D workspace.",
    image: floorPlanImage,
  },
  {
    number: "02",
    icon: Box,
    title: "3D Visualization",
    description:
      "Turn your floor plan into an interactive 3D view and understand your home's layout from different angles.",
    image: threeDImage,
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI House Assistant",
    description:
      "Get intelligent suggestions for room arrangements, space planning and house requirements while designing.",
    image: aiPlannerImage,
  },
  {
    number: "04",
    icon: Ruler,
    title: "Smart Measurements",
    description:
      "Work with accurate room dimensions and measurements to make your house planning more practical.",
    image: measurementsImage,
  },
  {
    number: "05",
    icon: Save,
    title: "Save Your Projects",
    description:
      "Keep your house designs organized and continue working on your saved projects whenever you want.",
    image: saveProjectImage,
  },
  {
    number: "06",
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Access your planning workspace comfortably across desktop, tablet and mobile screen sizes.",
    image: responsiveImage,
  },
  {
    number: "07",
    icon: LayoutTemplate,
    title: "Ready Templates",
    description:
      "Start faster with professionally planned house templates that you can use as a starting point.",
    image: templatesImage,
  },
  {
    number: "08",
    icon: Download,
    title: "Export & Share",
    description:
      "Prepare your completed design for sharing and keep your house planning work easy to manage.",
    image: exportImage,
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-[#f8f5eb] text-[#173d32]">
      <Header />

      <main>
        {/* =====================================================
            GREEN INTRO SECTION
        ====================================================== */}
        <section className="px-6 pb-14 pt-8 sm:px-10 lg:px-16 lg:pb-16 lg:pt-9">
          <div className="mx-auto max-w-[1320px]">
            <div className="relative overflow-hidden rounded-[28px] bg-[#123d31] shadow-[0_20px_55px_rgba(18,61,49,0.16)]">

              {/* Decorative Architecture */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full border border-[#80a99a]/20" />

                <div className="absolute -right-10 -top-10 h-[240px] w-[240px] rounded-full border border-[#80a99a]/15" />

                <div className="absolute bottom-[-150px] left-[-100px] h-[300px] w-[300px] rounded-full border border-[#80a99a]/10" />

                <div className="absolute right-[5%] top-[38%] h-px w-[300px] rotate-[32deg] bg-white/[0.07]" />

                <div className="absolute right-[9%] top-[54%] h-px w-[250px] rotate-[32deg] bg-white/[0.05]" />

                <div className="absolute right-[35%] top-0 h-full w-px bg-white/[0.025]" />
              </div>

              <div className="relative z-10 grid items-center gap-8 px-7 py-9 sm:px-10 lg:grid-cols-[1fr_300px] lg:px-14 lg:py-10">

                {/* LEFT CONTENT */}
                <div className="max-w-[790px]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-[#9ed0bc]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d2c1]">
                      Dream House Planner
                    </span>
                  </div>

                  <h1 className="font-serif text-[36px] leading-[1.08] tracking-[-0.04em] text-white sm:text-[46px] lg:text-[54px]">
                    Everything you need
                    <span className="block text-[#9fd0bc]">
                      to plan your dream home.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-[680px] text-[14px] leading-7 text-[#c3d7d0] sm:text-[15px]">
                    Plan your rooms, create detailed floor plans, explore your
                    home in 3D and get smart AI guidance — all from one simple
                    workspace.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#dce9e4]">
                      <Check size={14} className="text-[#9ed0bc]" />
                      2D Planning
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#dce9e4]">
                      <Check size={14} className="text-[#9ed0bc]" />
                      3D Visualization
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#dce9e4]">
                      <Check size={14} className="text-[#9ed0bc]" />
                      AI Assistance
                    </div>
                  </div>
                </div>

                {/* AI CARD */}
                <div className="relative">
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.08] p-2 backdrop-blur-sm">
                    <div className="rounded-[18px] bg-[#f8f5eb] p-5">

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08724f] text-white">
                          <Sparkles size={18} />
                        </div>

                        <div>
                          <p className="text-[13px] font-bold text-[#173d32]">
                            AI House Assistant
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#7b8983]">
                            Smart planning guidance
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl bg-[#eaf2ed] p-3.5">
                        <div className="flex gap-2.5">
                          <MessageCircle
                            size={15}
                            className="mt-0.5 shrink-0 text-[#08724f]"
                          />

                          <p className="text-[11px] leading-5 text-[#53665e]">
                            Get smart suggestions for rooms, space planning
                            and house requirements.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl bg-[#edf4ef] px-3 py-2.5">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-[#7b8983]">
                            Tools
                          </p>

                          <p className="mt-1 text-[13px] font-bold text-[#08724f]">
                            08 Features
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#edf4ef] px-3 py-2.5">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-[#7b8983]">
                            Planning
                          </p>

                          <p className="mt-1 text-[13px] font-bold text-[#173d32]">
                            2D + 3D
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES HEADING
        ====================================================== */}
        <section className="px-6 pb-10 pt-8 sm:px-10 lg:px-16 lg:pb-12 lg:pt-10">
          <div className="mx-auto max-w-[1320px]">

            <div className="grid items-end gap-7 border-b border-[#dfe6e1] pb-7 md:grid-cols-[1fr_1fr]">

              {/* LEFT */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-[2px] w-7 bg-[#08724f]" />

                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#08724f]">
                    Explore Features
                  </p>
                </div>

                <h2 className="font-serif text-[32px] leading-tight tracking-[-0.03em] text-[#173d32] sm:text-[40px]">
                  Built for better planning.
                </h2>
              </div>

              {/* RIGHT */}
              <div className="md:pb-1">
                <p className="max-w-[520px] text-sm leading-6 text-[#718079] md:ml-auto">
                  Simple and practical tools that help you move from your first
                  idea to a complete house plan — with everything you need in
                  one organized workspace.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURE CARDS
        ====================================================== */}
        <section className="px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.number}
                    className="group overflow-hidden rounded-[22px] border border-[#e1e7e3] bg-white shadow-[0_10px_35px_rgba(23,61,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(23,61,50,0.10)]"
                  >
                    {/* IMAGE */}
                    <div className="relative h-[205px] overflow-hidden bg-[#eef2ed]">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#08724f] shadow-sm">
                        <Icon size={17} strokeWidth={2} />
                      </div>

                      <span className="absolute bottom-4 right-4 rounded-full bg-[#173d32] px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-white">
                        {feature.number}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3 className="text-[19px] font-bold tracking-[-0.02em] text-[#173d32]">
                        {feature.title}
                      </h3>

                      <p className="mt-3 min-h-[96px] text-[13px] leading-6 text-[#718079]">
                        {feature.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-[#edf0ed] pt-4 text-[12px] font-bold text-[#08724f]">
                        Explore feature

                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col items-start justify-between gap-7 rounded-[26px] bg-[#173d32] px-7 py-9 sm:px-10 lg:flex-row lg:items-center lg:px-12">

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9bc7b5]">
                  Ready to start?
                </p>

                <h2 className="mt-2 font-serif text-[30px] text-white sm:text-[36px]">
                  Start planning your dream home.
                </h2>

                <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#c6d7d0]">
                  Create your first project and turn your house ideas into a
                  clear, organized plan.
                </p>
              </div>

              <Link
                to="/create-project"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#08724f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2f7f4]"
              >
                Create Project
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}