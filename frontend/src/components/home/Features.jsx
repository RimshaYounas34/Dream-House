import {
  ArrowUpRight,
  Sparkles,
  Ruler,
  LayoutGrid,
  Box,
  Save,
  Smartphone,
  Layers3,
  Share2,
} from "lucide-react";

import floorPlanImage from "../../assets/features/floor-plan.jpg";
import threeDImage from "../../assets/features/3d-view.jpg";
import aiPlannerImage from "../../assets/features/ai-planner.jpg";
import measurementsImage from "../../assets/features/measurements.jpg";
import saveProjectImage from "../../assets/features/save-project.jpg";
import responsiveImage from "../../assets/features/responsive.jpg";
import templatesImage from "../../assets/features/templates.jpg";
import exportImage from "../../assets/features/export.jpg";

/* =========================================================
   FEATURES DATA
========================================================= */

const features = [
  {
    number: "01",
    image: floorPlanImage,
    icon: LayoutGrid,
    tag: "PLAN",
    title: "2D Floor Planner",
    text: "Create accurate rooms, walls, doors and windows with an intuitive floor plan editor.",
  },
  {
    number: "02",
    image: threeDImage,
    icon: Box,
    tag: "VISUALIZE",
    title: "3D Visualization",
    text: "Transform your floor plan into a clear 3D view and understand your space better.",
  },
  {
    number: "03",
    image: aiPlannerImage,
    icon: Sparkles,
    tag: "AI POWERED",
    title: "AI House Assistant",
    text: "Describe your requirements and receive smart suggestions for rooms and layouts.",
  },
  {
    number: "04",
    image: measurementsImage,
    icon: Ruler,
    tag: "PRECISION",
    title: "Smart Measurements",
    text: "Keep plot dimensions, room sizes and measurements organized while designing.",
  },
  {
    number: "05",
    image: saveProjectImage,
    icon: Save,
    tag: "PROJECTS",
    title: "Save & Manage",
    text: "Save your house projects and come back anytime to continue your design.",
  },
  {
    number: "06",
    image: responsiveImage,
    icon: Smartphone,
    tag: "EVERYWHERE",
    title: "Responsive Design",
    text: "Plan comfortably across desktop, tablet and mobile with a flexible workspace.",
  },
  {
    number: "07",
    image: templatesImage,
    icon: Layers3,
    tag: "TEMPLATES",
    title: "Ready Templates",
    text: "Start faster with practical house layouts and inspiring design ideas.",
  },
  {
    number: "08",
    image: exportImage,
    icon: Share2,
    tag: "SHARE",
    title: "Export & Share",
    text: "Export your finished floor plan for sharing, printing or future reference.",
  },
];

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-[#dfe7e2] bg-white p-2.5 shadow-[0_8px_35px_rgba(20,55,44,0.045)] transition-all duration-500 hover:-translate-y-2 hover:border-[#c7d8d0] hover:shadow-[0_25px_55px_rgba(20,55,44,0.13)]">

      {/* IMAGE */}

      <div className="relative h-[205px] overflow-hidden rounded-[21px]">

        <img
          src={feature.image}
          alt={feature.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />

        {/* Dark gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#102f27]/70 via-[#102f27]/5 to-transparent" />

        {/* Top number */}

        <div className="absolute left-4 top-4 flex h-9 items-center rounded-full border border-white/50 bg-white/90 px-3 backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#0b5d46]">
            {feature.number}
          </span>
        </div>

        {/* Icon */}

        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b5d46]/95 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        {/* Image bottom label */}

        <div className="absolute bottom-4 left-4">

          <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {feature.tag}
          </span>

        </div>

        {/* Floating arrow */}

        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0b5d46] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight
            size={17}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

      </div>

      {/* CONTENT */}

      <div className="px-3 pb-4 pt-5">

        <h3 className="font-serif text-[21px] font-semibold leading-tight tracking-[-0.025em] text-[#173d32]">
          {feature.title}
        </h3>

        <p className="mt-3 min-h-[70px] text-[12.5px] leading-[1.8] text-[#687871]">
          {feature.text}
        </p>

        {/* Bottom */}

        <div className="mt-4 flex items-center justify-between border-t border-[#edf0ed] pt-4">

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7b8983]">
            DreamHouse Feature
          </span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf6f1] text-[#0b5d46] transition-all duration-300 group-hover:bg-[#0b5d46] group-hover:text-white">
            <ArrowUpRight size={13} />
          </span>

        </div>

      </div>
    </article>
  );
}

/* =========================================================
   FEATURES SECTION
========================================================= */

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#faf9f4] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#e5f2ec] opacity-60 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#e8f3ee] opacity-60 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-[45%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#f0f6f2] blur-3xl" />

      <div className="relative mx-auto max-w-[1250px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

          <div className="max-w-[720px]">

            {/* Eyebrow */}

            <div className="mb-5 flex items-center gap-3">

              <span className="h-px w-10 bg-[#0b5d46]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#72827b]">
                Everything you need
              </span>

            </div>

            {/* Heading */}

            <h2 className="font-serif text-[42px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#173d32] sm:text-[54px] lg:text-[60px]">

              One workspace.

              <span className="block text-[#0b5d46]">
                Endless possibilities.
              </span>

            </h2>

            <p className="mt-6 max-w-[620px] text-[14px] leading-7 text-[#66766f] sm:text-[15px]">
              Everything you need to turn an idea into a thoughtfully planned
              home — from your first sketch to a complete visual floor plan.
            </p>

          </div>

          {/* =================================================
              FEATURE SUMMARY
          ================================================= */}

          <div className="hidden lg:block">

            <div className="relative w-[230px] rounded-[24px] border border-[#dce5df] bg-white p-5 shadow-[0_15px_40px_rgba(20,55,44,0.07)]">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f2ec] text-[#0b5d46]">
                  <Sparkles size={18} />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#89958f]">
                  Built for you
                </span>

              </div>

              <p className="mt-5 font-serif text-[25px] font-semibold tracking-[-0.03em] text-[#173d32]">
                08
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#728079]">
                powerful tools to make home planning easier.
              </p>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#e8efeb]">
                <div className="h-full w-[82%] rounded-full bg-[#0b5d46]" />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            CARDS
        ===================================================== */}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}

        </div>

        {/* =====================================================
            BOTTOM CTA STRIP
        ===================================================== */}

        <div className="relative mt-14 overflow-hidden rounded-[28px] border border-[#d5e2db] bg-[#103d31] px-6 py-7 shadow-[0_20px_50px_rgba(16,61,49,0.12)] sm:px-8 sm:py-8">

          {/* Decorative circle */}

          <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full border-[30px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-20 right-40 h-36 w-36 rounded-full bg-[#2f725d]/20 blur-2xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles
                  size={14}
                  className="text-[#b7d8c9]"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#b7d8c9]">
                  Designed for dreamers
                </span>

              </div>

              <h3 className="mt-2 font-serif text-[25px] font-semibold tracking-[-0.025em] text-white sm:text-[29px]">
                Plan it. Visualize it. Make it yours.
              </h3>

            </div>

            <div className="flex shrink-0 items-center gap-3">

              <div className="flex -space-x-2">

                <div className="h-8 w-8 rounded-full border-2 border-[#103d31] bg-[#dcebe4]" />
                <div className="h-8 w-8 rounded-full border-2 border-[#103d31] bg-[#b7d8c9]" />
                <div className="h-8 w-8 rounded-full border-2 border-[#103d31] bg-[#8eb7a5]" />

              </div>

              <span className="text-[10px] font-medium text-[#c8ddd4]">
                Your ideas, your home.
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}