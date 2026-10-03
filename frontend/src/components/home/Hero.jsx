import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Sparkles,
  Home,
  Box,
  CheckCircle2,
  Star,
  Leaf,
} from "lucide-react";

import houseImage from "../../assets/hero-house.png";
import threeDViewImage from "../../assets/ThreeDview.jpg";

/* =========================================================
   2D FLOOR PLAN CARD
========================================================= */

function FloorPlanCard() {
  return (
    <div className="absolute left-[-20px] top-[72px] z-30 hidden w-[255px] rounded-2xl bg-white p-4 shadow-[0_18px_50px_rgba(20,60,48,0.16)] lg:block">
      <div className="flex gap-4">

        {/* FLOOR PLAN */}
        <div className="h-[112px] w-[84px] shrink-0 rounded-lg border border-[#d8e1dc] bg-[#f8faf8] p-[5px]">
          <div className="grid h-full grid-cols-4 grid-rows-5 gap-[2px] border-2 border-[#335c4f] bg-white p-[3px]">

            <div className="col-span-2 row-span-2 flex items-center justify-center border border-[#8da49b] bg-[#eff5f1]">
              <span className="text-[5px] font-bold text-[#59766a]">
                LIVING
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                BED
              </span>
            </div>

            <div className="flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                BED
              </span>
            </div>

            <div className="flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                BATH
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                KITCHEN
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                DINING
              </span>
            </div>

            <div className="col-span-4 flex items-center justify-center border border-[#8da49b]">
              <span className="text-[5px] text-[#71857c]">
                ENTRY
              </span>
            </div>

          </div>
        </div>

        {/* TEXT */}
        <div className="pt-2">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f1eb] text-[#075d46]">
              <Box size={18} />
            </div>

            <div>
              <p className="text-[10px] text-[#7c8b84]">
                Planning mode
              </p>

              <p className="text-[13px] font-bold text-[#172c27]">
                2D Floor Plan
              </p>
            </div>

          </div>

          <p className="mt-3 text-[10px] leading-4 text-[#75837c]">
            Plan your space
            <br />
            perfectly
          </p>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   3D PREVIEW CARD
========================================================= */

function PreviewCard() {
  return (
    <div className="absolute right-[-18px] top-[72px] z-30 hidden w-[230px] rounded-2xl bg-white p-4 shadow-[0_18px_50px_rgba(20,60,48,0.16)] xl:block">

      <div className="relative h-[96px] overflow-hidden rounded-xl">

        <img
          src={threeDViewImage}
          alt="3D home preview"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#153e32]/30 to-transparent" />

      </div>

      <div className="mt-3 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#075d46] text-white">
          <Box size={19} />
        </div>

        <div>
          <p className="text-[10px] text-[#7c8b84]">
            Preview
          </p>

          <p className="text-[14px] font-bold text-[#172c27]">
            3D Preview
          </p>
        </div>

      </div>

      <p className="mt-2 text-[10px] text-[#74827b]">
        See your dream come to life
      </p>

    </div>
  );
}

/* =========================================================
   AI PLANNER CARD
========================================================= */

function AIPlannerCard() {
  return (
    <div className="absolute bottom-[105px] right-0 z-30 hidden w-[280px] rounded-2xl bg-white p-5 shadow-[0_18px_50px_rgba(20,60,48,0.17)] sm:block xl:right-[-15px]">

      <div className="flex items-center gap-4">

        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-[#075d46] text-white">
          <Sparkles size={23} />
        </div>

        <div className="flex-1">

          <p className="text-[10px] text-[#7b8982]">
            Smart Assistant
          </p>

          <p className="mt-1 text-[15px] font-bold text-[#172c27]">
            AI Planner
          </p>

        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2f0ea] text-[#075d46]">
          <ArrowRight size={14} />
        </div>

      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#718079]">
        Get smart suggestions for rooms, layouts and your home's flow.
      </p>

    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-white"
    >

      {/* BACKGROUND CIRCLES */}

      <div className="pointer-events-none absolute left-[-110px] top-[95px] h-[350px] w-[350px] rounded-full bg-[#eef7f3]" />

      <div className="pointer-events-none absolute right-[-65px] top-[115px] h-[170px] w-[170px] rounded-full bg-[#d6ece3]" />

      <div className="pointer-events-none absolute bottom-[100px] left-[42%] h-[250px] w-[250px] rounded-full bg-[#e9f5f0] blur-3xl" />

      {/* =================================================
          MAIN HERO
      ================================================= */}

      <div className="relative mx-auto grid min-h-[895px] max-w-[1400px] items-center gap-12 px-6 pb-28 pt-[70px] lg:grid-cols-[0.84fr_1.16fr] lg:px-10">

        {/* LEFT CONTENT */}

        <div className="relative z-20 max-w-[570px]">

          {/* BADGE */}

          <div className="mb-7 inline-flex items-center gap-3 rounded-full bg-[#e4f3ed] px-5 py-2.5">

            <Sparkles
              size={17}
              fill="currentColor"
              className="text-[#075d46]"
            />

            <span className="text-[13px] font-semibold text-[#145541]">
              Smart Home Design, Made Simple
            </span>

          </div>

          {/* HEADING */}

          <h1 className="font-serif text-[54px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#102f27] sm:text-[65px] lg:text-[72px]">

            Design Your

            <span className="block text-[#075d46]">
              Dream Home.
            </span>

            <span className="block">
              Your Way.
            </span>

          </h1>

          {/* DESCRIPTION */}

          <p className="mt-7 max-w-[520px] text-[16px] leading-[1.75] text-[#63736b]">
            Turn your ideas into beautiful floor plans with Dream House
            Planner. Create, customize and visualize your perfect home in
            one simple workspace.
          </p>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/design-method"
              className="group inline-flex items-center gap-3 rounded-full bg-[#075d46] px-8 py-4 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(7,93,70,0.20)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#064d3a]"
            >

              <span className="text-white">
                Get Started
              </span>

              <ArrowRight
                size={18}
                className="text-white transition-transform group-hover:translate-x-1"
              />

            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-3 rounded-full border border-[#aebdb6] bg-white px-8 py-4 text-[14px] font-semibold text-[#24463c] transition hover:border-[#075d46] hover:text-[#075d46]"
            >

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f2ed]">

                <Play
                  size={11}
                  fill="currentColor"
                  className="ml-[1px] text-[#075d46]"
                />

              </span>

              Watch Demo

            </a>

          </div>

          {/* FEATURES */}

          <div
            id="features"
            className="mt-10 flex flex-wrap gap-x-7 gap-y-4"
          >

            <div className="flex items-center gap-2.5">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f2ec]">

                <CheckCircle2
                  size={17}
                  className="text-[#075d46]"
                />

              </span>

              <span className="text-[12px] font-medium text-[#63736b]">
                Easy to use
              </span>

            </div>

            <div className="flex items-center gap-2.5">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f2ec]">

                <Box
                  size={16}
                  className="text-[#075d46]"
                />

              </span>

              <span className="text-[12px] font-medium text-[#63736b]">
                2D & 3D visualization
              </span>

            </div>

            <div className="flex items-center gap-2.5">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f2ec]">

                <Sparkles
                  size={16}
                  className="text-[#075d46]"
                />

              </span>

              <span className="text-[12px] font-medium text-[#63736b]">
                Smart planning
              </span>

            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT HOUSE IMAGE
        ================================================= */}

        <div className="relative z-10 mx-auto h-[650px] w-full max-w-[820px] lg:ml-auto">

          {/* HOUSE IMAGE */}

          <div className="absolute inset-0 overflow-hidden rounded-[45%_0_0_45%]">

            <img
              src={houseImage}
              alt="Modern luxury dream house"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-[#eef8f4]/80 via-transparent to-transparent" />

          </div>

          {/* 2D FLOOR PLAN CARD */}

          <FloorPlanCard />

          {/* 3D PREVIEW CARD */}

          <PreviewCard />

          {/* AI PLANNER CARD */}

          <AIPlannerCard />

        </div>
      </div>

      {/* =================================================
          CURVED GREEN BOTTOM
      ================================================= */}

      <div className="absolute bottom-[-50px] left-[-5%] z-20 h-[135px] w-[110%] rounded-[50%_50%_0_0] bg-[#edf8f4]" />

      {/* =================================================
          SCROLL INDICATOR
      ================================================= */}

      <div className="absolute bottom-[36px] left-1/2 z-30 hidden -translate-x-1/2 sm:block">

        <div className="flex h-10 w-7 items-center justify-center rounded-full border-2 border-[#075d46] bg-white">

          <div className="h-2.5 w-1 rounded-full bg-[#075d46]" />

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="relative z-40 mx-auto max-w-[900px] px-6 pb-10">

        <div className="grid grid-cols-1 rounded-2xl bg-white px-5 py-6 sm:grid-cols-3">

          {/* 10K */}

          <div className="flex items-center justify-center gap-4 border-b border-[#dce5e0] py-4 sm:border-b-0 sm:border-r">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2ec] text-[#075d46]">
              <Home size={22} />
            </div>

            <div>

              <p className="text-[21px] font-bold text-[#102f27]">
                10K+
              </p>

              <p className="text-[11px] text-[#718079]">
                Happy Homeowners
              </p>

            </div>

          </div>

          {/* 4.9 */}

          <div className="flex items-center justify-center gap-4 border-b border-[#dce5e0] py-4 sm:border-b-0 sm:border-r">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2ec] text-[#075d46]">
              <Star size={22} />
            </div>

            <div>

              <p className="text-[21px] font-bold text-[#102f27]">
                4.9/5
              </p>

              <p className="text-[11px] text-[#718079]">
                User Satisfaction
              </p>

            </div>

          </div>

          {/* 100% */}

          <div className="flex items-center justify-center gap-4 py-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2ec] text-[#075d46]">
              <Leaf size={22} />
            </div>

            <div>

              <p className="text-[21px] font-bold text-[#102f27]">
                100%
              </p>

              <p className="text-[11px] text-[#718079]">
                Creative Freedom
              </p>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}