import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import ctaHouse from "../../assets/ctaHouse.jpg";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#f8f5eb] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">

        {/* ================= MAIN CTA ================= */}
        <div className="group relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#173d32] shadow-[0_25px_70px_rgba(23,61,50,0.16)]">

          {/* ================= HOUSE IMAGE ================= */}
          <img
            src={ctaHouse}
            alt="Dream House"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]"
          />

          {/* Left dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#092e23]/95 via-[#123f32]/78 to-[#123f32]/20" />

          {/* Bottom soft gradient */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#092e23]/70 to-transparent" />

          {/* ================= CONTENT ================= */}
          <div className="relative z-10 flex min-h-[510px] items-center">

            <div className="max-w-[690px] px-7 py-16 sm:px-12 lg:px-16">

              {/* Small label */}
              <div className="mb-6 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-[#a9cdbb]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#c1d9cd]">
                  Start Building Your Vision
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-[42px] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-[52px] lg:text-[61px]">
                Your dream home
                <br />

                <span className="text-[#b8d8c7]">
                  starts with a plan.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-[#d4e3dc] sm:text-[15px]">
                Turn your ideas into a clear floor plan, explore your home in
                3D, and refine every detail with smart planning tools.
              </p>

              {/* ================= BUTTONS ================= */}
              <div className="mt-8 flex flex-wrap gap-3">

                {/* Create Project */}
                <Link
                  to="/create-project"
                  className="group/btn inline-flex h-[50px] items-center gap-2.5 rounded-xl bg-white px-6 text-[12px] font-bold text-[#0b5d46] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f8f5]"
                >
                  <Sparkles
                    size={15}
                    className="text-[#0b5d46]"
                  />

                  <span className="text-[#0b5d46]">
                    Create Your Project
                  </span>

                  <ArrowRight
                    size={15}
                    className="text-[#0b5d46] transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>

                {/* Explore Templates */}
                <Link
                  to="/templates"
                  className="group/template inline-flex h-[50px] items-center gap-2 rounded-xl bg-white px-5 text-[12px] font-bold text-[#0b5d46] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f8f5]"
                >
                  <span className="text-[#0b5d46]">
                    Explore Templates
                  </span>

                  <ArrowUpRight
                    size={14}
                    className="text-[#0b5d46] transition-transform duration-300 group-hover/template:translate-x-0.5 group-hover/template:-translate-y-0.5"
                  />
                </Link>

              </div>

              {/* Trust points */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-[#a9d0ba]"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#d0e1d9]">
                    Editable 2D Plans
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-[#a9d0ba]"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#d0e1d9]">
                    3D Visualization
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-[#a9d0ba]"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#d0e1d9]">
                    AI Assistance
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* ================= TOP RIGHT INFO ================= */}
          <div className="absolute right-6 top-6 hidden rounded-2xl border border-white/20 bg-[#102f27]/55 p-3.5 backdrop-blur-md sm:block lg:right-8 lg:top-8">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Sparkles
                  size={16}
                  className="text-[#b9d7c8]"
                />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9ebcaf]">
                  Smart Planning
                </p>

                <p className="mt-0.5 text-[11px] font-bold text-white">
                  Design with confidence
                </p>
              </div>

            </div>
          </div>

          {/* ================= BOTTOM RIGHT LABEL ================= */}
          <div className="absolute bottom-6 right-6 hidden sm:block lg:bottom-8 lg:right-8">

            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-[#102f27]/60 px-4 py-2.5 backdrop-blur-md">

              <span className="h-2 w-2 rounded-full bg-[#9dccb2]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/80">
                From idea to home
              </span>

            </div>
          </div>

          {/* ================= DECORATIVE FRAME ================= */}
          <div className="pointer-events-none absolute inset-5 rounded-[21px] border border-white/[0.12]" />

        </div>

        {/* Bottom caption */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#08724f]" />

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7b8881]">
            Plan • Visualize • Create
          </p>

          <span className="h-px w-8 bg-[#08724f]" />
        </div>

      </div>
    </section>
  );
}