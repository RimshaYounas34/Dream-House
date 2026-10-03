import { useEffect, useState } from "react";
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
  X,
  MousePointer2,
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
   ANIMATED 2D → 3D DEMO
========================================================= */

function AnimatedDemo() {
  return (
    <div className="relative h-[285px] overflow-hidden rounded-[20px] bg-[#f0f7f3] sm:h-[390px]">

      <style>{`

        @keyframes planMove {
          0%, 20% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }

          38%, 100% {
            opacity: 0;
            transform: translateX(-35px) scale(.86);
          }
        }

        @keyframes transformMove {
          0%, 25% {
            opacity: 0;
            transform: translateX(-30px) scale(.8);
          }

          42%, 65% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }

          78%, 100% {
            opacity: 0;
            transform: translateX(25px) scale(1.08);
          }
        }

        @keyframes previewMove {
          0%, 43% {
            opacity: 0;
            transform: translateX(40px) scale(.9);
          }

          58%, 100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes glowMove {
          0%, 25% {
            opacity: 0;
            transform: scale(.6);
          }

          45% {
            opacity: .9;
            transform: scale(1);
          }

          70%, 100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes textOne {
          0%, 22% {
            opacity: 1;
          }

          36%, 100% {
            opacity: 0;
          }
        }

        @keyframes textTwo {
          0%, 34% {
            opacity: 0;
          }

          45%, 67% {
            opacity: 1;
          }

          78%, 100% {
            opacity: 0;
          }
        }

        @keyframes textThree {
          0%, 57% {
            opacity: 0;
          }

          68%, 100% {
            opacity: 1;
          }
        }

        @keyframes aiAppear {
          0%, 62% {
            opacity: 0;
            transform: translateY(12px);
          }

          73%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .demo-plan {
          animation: planMove 7s ease-in-out infinite;
        }

        .demo-transform {
          animation: transformMove 7s ease-in-out infinite;
        }

        .demo-preview {
          animation: previewMove 7s ease-in-out infinite;
        }

        .demo-glow {
          animation: glowMove 7s ease-in-out infinite;
        }

        .demo-text-one {
          animation: textOne 7s ease-in-out infinite;
        }

        .demo-text-two {
          animation: textTwo 7s ease-in-out infinite;
        }

        .demo-text-three {
          animation: textThree 7s ease-in-out infinite;
        }

        .demo-ai {
          animation: aiAppear 7s ease-in-out infinite;
        }

      `}</style>

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,#edf7f2_50%,#e3f1eb_100%)]" />

      {/* 2D FLOOR PLAN */}

      <div className="demo-plan absolute left-[6%] top-1/2 w-[42%] max-w-[285px] -translate-y-1/2 rounded-xl border border-[#8da49b] bg-white p-3 shadow-[0_16px_35px_rgba(20,60,48,0.12)]">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#075d46]">
            2D Floor Plan
          </span>

          <Box
            size={13}
            className="text-[#075d46]"
          />

        </div>

        <div className="grid aspect-[1.3] grid-cols-4 grid-rows-4 gap-[2px] border-2 border-[#335c4f] bg-white p-1">

          <div className="col-span-2 row-span-2 flex items-center justify-center border border-[#8da49b] bg-[#eff5f1]">
            <span className="text-[7px] font-bold text-[#59766a]">
              LIVING
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-center border border-[#8da49b]">
            <span className="text-[7px] text-[#71857c]">
              BEDROOM
            </span>
          </div>

          <div className="flex items-center justify-center border border-[#8da49b]">
            <span className="text-[7px] text-[#71857c]">
              BED
            </span>
          </div>

          <div className="flex items-center justify-center border border-[#8da49b]">
            <span className="text-[7px] text-[#71857c]">
              BATH
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-center border border-[#8da49b] bg-[#f7faf8]">
            <span className="text-[7px] text-[#71857c]">
              KITCHEN
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-center border border-[#8da49b]">
            <span className="text-[7px] text-[#71857c]">
              DINING
            </span>
          </div>

          <div className="col-span-4 flex items-center justify-center border border-[#8da49b]">
            <span className="text-[7px] text-[#71857c]">
              ENTRY
            </span>
          </div>

        </div>
      </div>

      {/* TRANSFORMATION GLOW */}

      <div className="demo-transform absolute left-[38%] top-1/2 z-10 h-32 w-32 -translate-y-1/2 rounded-full bg-[#8dd2ba]/30 blur-2xl" />

      <div className="demo-glow absolute left-1/2 top-1/2 z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#67b99b]/25 blur-3xl" />

      {/* TRANSFORM LABEL */}

      <div className="demo-transform absolute left-[43%] top-1/2 z-20 -translate-y-1/2">

        <div className="rounded-full border border-[#7dbda8] bg-white/95 px-3 py-2 text-[9px] font-bold text-[#075d46] shadow-lg">
          Transforming...
        </div>

      </div>

      {/* 3D PREVIEW */}

      <div className="demo-preview absolute right-[5%] top-1/2 w-[48%] max-w-[390px] -translate-y-1/2 overflow-hidden rounded-2xl border border-white bg-white shadow-[0_20px_50px_rgba(20,60,48,0.20)]">

        <div className="relative aspect-[1.55]">

          <img
            src={threeDViewImage}
            alt="3D house preview"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#123c31]/35 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold text-[#075d46] shadow">
            3D Preview
          </div>

        </div>

      </div>

      {/* TEXT 1 */}

      <div className="demo-text-one absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#075d46] px-4 py-2 text-[10px] font-semibold text-white shadow-lg">
        Design your floor plan
      </div>

      {/* TEXT 2 */}

      <div className="demo-text-two absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#075d46] px-4 py-2 text-[10px] font-semibold text-white shadow-lg">
        Your plan is becoming 3D
      </div>

      {/* TEXT 3 */}

      <div className="demo-text-three absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#075d46] px-4 py-2 text-[10px] font-semibold text-white shadow-lg">
        Visualize your dream home
      </div>

      {/* AI */}

      <div className="demo-ai absolute right-4 top-4 z-30 flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(20,60,48,0.15)]">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e1f1eb] text-[#075d46]">
          <Sparkles size={14} />
        </div>

        <div>
          <p className="text-[8px] text-[#819089]">
            Smart Assistant
          </p>

          <p className="text-[10px] font-bold text-[#172c27]">
            AI Planner
          </p>
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DEMO MODAL
========================================================= */

function DemoModal({ onClose }) {

  useEffect(() => {

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";

    };

  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08251d]/70 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {

        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div
        className="relative max-h-[94vh] w-full max-w-[980px] overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.30)]"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="relative overflow-hidden bg-[#075d46] px-6 pb-7 pt-7 sm:px-9">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 max-w-[680px]">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">

              <Play
                size={12}
                fill="currentColor"
              />

              Interactive Product Demo

            </div>

            <h2 className="font-serif text-[30px] font-semibold leading-tight text-white sm:text-[38px]">

              From a simple plan to

              <span className="block text-[#bfe8d9]">
                your dream home.
              </span>

            </h2>

            <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-white/75 sm:text-[14px]">

              Watch how Dream House Planner turns a 2D floor plan into a
              3D visualization and enhances your design with AI.

            </p>

          </div>

        </div>

        {/* MODAL CONTENT */}

        <div className="p-5 sm:p-8">

          <AnimatedDemo />

          {/* STEPS */}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            {/* STEP 1 */}

            <div className="rounded-2xl border border-[#e1e9e5] bg-[#f8fbf9] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1f1eb] text-[#075d46]">
                  <Box size={19} />
                </div>

                <div>

                  <p className="text-[10px] font-medium text-[#819089]">
                    STEP 01
                  </p>

                  <p className="text-[13px] font-bold text-[#172c27]">
                    Create a Floor Plan
                  </p>

                </div>

              </div>

              <p className="mt-3 text-[11px] leading-5 text-[#718079]">
                Arrange rooms, walls, doors and windows according to your
                home's requirements.
              </p>

            </div>

            {/* STEP 2 */}

            <div className="rounded-2xl border border-[#e1e9e5] bg-[#f8fbf9] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1f1eb] text-[#075d46]">
                  <Home size={19} />
                </div>

                <div>

                  <p className="text-[10px] font-medium text-[#819089]">
                    STEP 02
                  </p>

                  <p className="text-[13px] font-bold text-[#172c27]">
                    Visualize in 3D
                  </p>

                </div>

              </div>

              <p className="mt-3 text-[11px] leading-5 text-[#718079]">
                Switch from a 2D plan to a realistic 3D view of your future
                home.
              </p>

            </div>

            {/* STEP 3 */}

            <div className="rounded-2xl border border-[#e1e9e5] bg-[#f8fbf9] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1f1eb] text-[#075d46]">
                  <Sparkles size={19} />
                </div>

                <div>

                  <p className="text-[10px] font-medium text-[#819089]">
                    STEP 03
                  </p>

                  <p className="text-[13px] font-bold text-[#172c27]">
                    Get AI Suggestions
                  </p>

                </div>

              </div>

              <p className="mt-3 text-[11px] leading-5 text-[#718079]">
                Get smart suggestions to improve your rooms, layout and
                overall home flow.
              </p>

            </div>

          </div>

          {/* CTA */}

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#edf7f2] px-5 py-4 sm:flex-row">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#075d46]">
                <MousePointer2 size={16} />
              </div>

              <p className="text-[12px] font-medium text-[#35564b]">
                Ready to start planning your own home?
              </p>

            </div>

            <Link
              to="/design-method"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-[#075d46] px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(7,93,70,0.18)] transition hover:-translate-y-0.5 hover:bg-[#064d3a]"
            >
              Start Planning
              <ArrowRight size={15} />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {

  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-white"
      >

        {/* BACKGROUND CIRCLES */}

        <div className="pointer-events-none absolute left-[-110px] top-[95px] h-[350px] w-[350px] rounded-full bg-[#eef7f3]" />

        <div className="pointer-events-none absolute right-[-65px] top-[115px] h-[170px] w-[170px] rounded-full bg-[#d6ece3]" />

        <div className="pointer-events-none absolute bottom-[100px] left-[42%] h-[250px] w-[250px] rounded-full bg-[#e9f5f0] blur-3xl" />

        {/* MAIN HERO */}

        <div className="relative mx-auto grid min-h-[895px] max-w-[1400px] items-center gap-12 px-6 pb-28 pt-[70px] lg:grid-cols-[0.84fr_1.16fr] lg:px-10">

          {/* LEFT */}

          <div className="relative z-20 max-w-[570px]">

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

            <h1 className="font-serif text-[54px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#102f27] sm:text-[65px] lg:text-[72px]">

              Design Your

              <span className="block text-[#075d46]">
                Dream Home.
              </span>

              <span className="block">
                Your Way.
              </span>

            </h1>

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

                <span>
                  Get Started
                </span>

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />

              </Link>

              {/* WATCH DEMO */}

              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="group inline-flex items-center gap-3 rounded-full border border-[#aebdb6] bg-white px-8 py-4 text-[14px] font-semibold text-[#24463c] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#075d46] hover:text-[#075d46]"
              >

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f2ed] transition group-hover:bg-[#d8eee5]">

                  <Play
                    size={11}
                    fill="currentColor"
                    className="ml-[1px] text-[#075d46]"
                  />

                </span>

                Watch Demo

              </button>

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

          {/* RIGHT HOUSE IMAGE */}

          <div className="relative z-10 mx-auto h-[650px] w-full max-w-[820px] lg:ml-auto">

            <div className="absolute inset-0 overflow-hidden rounded-[45%_0_0_45%]">

              <img
                src={houseImage}
                alt="Modern luxury dream house"
                className="h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-[#eef8f4]/80 via-transparent to-transparent" />

            </div>

            <FloorPlanCard />

            <PreviewCard />

            <AIPlannerCard />

          </div>

        </div>

        {/* CURVED GREEN BOTTOM */}

        <div className="absolute bottom-[-50px] left-[-5%] z-20 h-[135px] w-[110%] rounded-[50%_50%_0_0] bg-[#edf8f4]" />

        {/* SCROLL */}

        <div className="absolute bottom-[36px] left-1/2 z-30 hidden -translate-x-1/2 sm:block">

          <div className="flex h-10 w-7 items-center justify-center rounded-full border-2 border-[#075d46] bg-white">

            <div className="h-2.5 w-1 rounded-full bg-[#075d46]" />

          </div>

        </div>

        {/* STATS */}

        <div className="relative z-40 mx-auto max-w-[900px] px-6 pb-10">

          <div className="grid grid-cols-1 rounded-2xl bg-white px-5 py-6 sm:grid-cols-3">

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

      {/* DEMO MODAL */}

      {showDemo && (
        <DemoModal
          onClose={() => setShowDemo(false)}
        />
      )}

    </>
  );
}