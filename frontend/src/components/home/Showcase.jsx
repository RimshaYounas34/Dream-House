import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Box,
  CheckCircle2,
  Sparkles,
  Ruler,
} from "lucide-react";

import showcaseHouse from "../../assets/showcase-house.jpg";

export default function Showcase() {
  const points = [
    {
      icon: Ruler,
      number: "01",
      title: "2D Planning",
      text: "Place rooms, walls, doors and windows with a clear top-down layout.",
      link: "/floor-plan-editor",
    },
    {
      icon: Box,
      number: "02",
      title: "3D Visualization",
      text: "Switch to 3D and understand your home's spaces, flow and proportions.",
      link: "/3d-view",
    },
    {
      icon: Sparkles,
      number: "03",
      title: "AI Guidance",
      text: "Ask for smart ideas and improvements whenever you need them.",
      link: "/ai-planner",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f8f5eb] px-5 pb-16 pt-2 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24"
    >
      <div className="relative mx-auto max-w-[1280px]">

        {/* ================= SECTION HEADER ================= */}
        <div className="mb-6 flex items-center justify-between sm:mb-7">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#08724f]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#08724f]">
              Visualize Your Home
            </span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#d7e1db] bg-white/70 px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#08724f]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#61726a]">
              2D + 3D Planning
            </span>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">

          {/* ================= IMAGE SIDE ================= */}
          <div className="relative">

            {/* Main image frame */}
            <div className="rounded-[26px] border border-[#e0e6e1] bg-white p-2.5 shadow-[0_18px_50px_rgba(31,61,51,0.11)]">

              <div className="relative overflow-hidden rounded-[19px]">

                <img
                  src={showcaseHouse}
                  alt="DreamHouse 3D visualization"
                  className="h-[340px] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025] sm:h-[395px] lg:h-[430px]"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102e25]/65 via-transparent to-transparent" />

                {/* Image text */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                      DreamHouse Preview
                    </p>

                    <h3 className="mt-1 font-serif text-[23px] font-medium text-white sm:text-[26px]">
                      See it before you build it.
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#173d32] shadow-xl sm:h-11 sm:w-11">
                    <ArrowUpRight size={18} />
                  </div>

                </div>
              </div>
            </div>

            {/* ================= AI MATERIAL CARD ================= */}
            <div className="absolute -bottom-5 right-2 w-[220px] rounded-[17px] border border-[#d8e2dc] bg-[#fbfaf5]/95 p-3.5 shadow-[0_15px_35px_rgba(23,61,50,0.14)] backdrop-blur-md sm:-right-4 sm:w-[230px]">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#87938d]">
                    AI Material Suggestions
                  </p>

                  <p className="mt-1 text-[12px] font-bold text-[#24483c]">
                    Exterior palette
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0eb]">
                  <Sparkles
                    size={14}
                    className="text-[#08724f]"
                  />
                </div>

              </div>

              <div className="mt-2.5 flex gap-1.5">
                <div className="h-8 flex-1 rounded-md bg-[#d9d0bd]" />
                <div className="h-8 flex-1 rounded-md bg-[#a7b0a2]" />
                <div className="h-8 flex-1 rounded-md bg-[#d8ddd5]" />
                <div className="h-8 flex-1 rounded-md bg-[#8e9b8d]" />
              </div>
            </div>

            {/* ================= READY BADGE ================= */}
            <div className="absolute left-2 top-5 hidden rounded-xl border border-[#d8e2dc] bg-white px-3.5 py-2.5 shadow-lg sm:block">

              <div className="flex items-center gap-2.5">

                <CheckCircle2
                  size={16}
                  className="text-[#08724f]"
                />

                <div>
                  <p className="text-[10px] font-bold text-[#24483c]">
                    Design Ready
                  </p>

                  <p className="mt-0.5 text-[8px] text-[#829088]">
                    Visualized in 3D
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* ================= CONTENT SIDE ================= */}
          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">
              See your space
            </p>

            <h2 className="mt-2.5 max-w-[590px] font-serif text-[43px] font-medium leading-[1.04] tracking-[-0.045em] text-[#183b31] sm:text-[49px] lg:text-[54px]">
              One plan.
              <br />

              <span className="text-[#08724f]">
                Two ways to understand it.
              </span>
            </h2>

            <p className="mt-4 max-w-[550px] text-[15px] leading-7 text-[#69736d]">
              Build precisely in 2D, then switch to a 3D view for a natural
              understanding of your home's scale, flow and atmosphere.
            </p>

            {/* ================= FEATURE CARDS ================= */}
            <div className="mt-5 space-y-1.5">

              {points.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.number}
                    to={item.link}
                    className="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-[#d5e2da] hover:bg-white/80 hover:shadow-[0_8px_25px_rgba(23,61,50,0.06)]"
                  >

                    {/* Icon */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#e7efe9] text-[#08724f] transition-all duration-300 group-hover:bg-[#08724f] group-hover:text-white">

                      <Icon
                        size={20}
                        strokeWidth={1.8}
                      />

                      <span className="absolute -right-1.5 -top-1.5 text-[8px] font-bold text-[#87968e]">
                        {item.number}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1 pt-0.5">

                      <div className="flex items-center justify-between gap-3">

                        <h3 className="text-[16px] font-bold text-[#24483c]">
                          {item.title}
                        </h3>

                        <ArrowRight
                          size={15}
                          className="shrink-0 text-[#a0aaa5] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#08724f]"
                        />
                      </div>

                      <p className="mt-1 text-[13px] leading-6 text-[#707a74]">
                        {item.text}
                      </p>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#08724f] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Open this feature
                      </p>
                    </div>

                  </Link>
                );
              })}
            </div>

            {/* ================= BENEFITS ================= */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#dfe5df] pt-4">

              <span className="flex items-center gap-2 rounded-full bg-[#e8efe9] px-3.5 py-1.5 text-[10px] font-bold text-[#315348]">
                <CheckCircle2
                  size={12}
                  className="text-[#08724f]"
                />
                Accurate Planning
              </span>

              <span className="flex items-center gap-2 rounded-full bg-[#e8efe9] px-3.5 py-1.5 text-[10px] font-bold text-[#315348]">
                <CheckCircle2
                  size={12}
                  className="text-[#08724f]"
                />
                Easy Visualization
              </span>

              <span className="flex items-center gap-2 rounded-full bg-[#e8efe9] px-3.5 py-1.5 text-[10px] font-bold text-[#315348]">
                <CheckCircle2
                  size={12}
                  className="text-[#08724f]"
                />
                AI Assisted
              </span>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}