import {
  FilePlus2,
  PenTool,
  Box,
  Sparkles,
  Download,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FilePlus2,
    title: "Start a Project",
    text: "Add your plot size, floors and required rooms.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "Create Your Plan",
    text: "Arrange your rooms and spaces with ease.",
  },
  {
    number: "03",
    icon: Box,
    title: "Explore in 3D",
    text: "See how your home looks beyond the 2D plan.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Use AI",
    text: "Get smart ideas for layouts and room planning.",
  },
  {
    number: "05",
    icon: Download,
    title: "Save & Export",
    text: "Keep your design and export it when ready.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
    >
      {/* Soft background shape */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[350px] w-[350px] rounded-full bg-[#eef6f1] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#f3f7f2] blur-3xl" />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="mx-auto max-w-[680px] text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#0b5d46]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#7a8982]">
              How it works
            </span>

            <span className="h-px w-8 bg-[#0b5d46]" />
          </div>

          <h2 className="font-serif text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#173d32] sm:text-[50px]">
            Plan your home
            <span className="text-[#0b5d46]"> in a few simple steps.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[560px] text-[13px] leading-7 text-[#718079] sm:text-[14px]">
            Everything is designed to make home planning feel simple,
            visual and enjoyable — from your first idea to your final plan.
          </p>
        </div>

        {/* Main steps */}
        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute left-[10%] right-[10%] top-[48px] hidden h-px bg-[#d8e4de] lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative text-center"
                >
                  {/* Number + Icon */}
                  <div className="relative z-10 mx-auto flex h-[96px] w-[96px] items-center justify-center rounded-full border border-[#dbe7e1] bg-white shadow-[0_8px_25px_rgba(20,55,44,0.06)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#a9cabb] group-hover:shadow-[0_15px_35px_rgba(11,93,70,0.12)]">
                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#edf5f1] text-[#0b5d46] transition-all duration-500 group-hover:bg-[#0b5d46] group-hover:text-white">
                      <Icon size={25} strokeWidth={1.7} />
                    </div>

                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0b5d46] font-serif text-[10px] font-semibold text-white shadow-sm">
                      {step.number}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="mt-6 px-2">
                    <h3 className="font-serif text-[18px] font-semibold text-[#173d32] transition-colors duration-300 group-hover:text-[#0b5d46]">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-[180px] text-[10.5px] leading-5 text-[#7a8781]">
                      {step.text}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-3 top-[43px] z-20 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-[#9aaba3] lg:flex">
                      <ArrowRight size={13} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Small visual strip */}
        <div className="relative mx-auto mt-16 max-w-[920px] overflow-hidden rounded-[28px] border border-[#dce7e1] bg-[#f7faf8] px-6 py-7 sm:px-9">
          {/* Architectural lines */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-[18%] top-0 h-full w-px bg-[#dce7e1]" />
            <div className="absolute left-[50%] top-0 h-full w-px bg-[#dce7e1]" />
            <div className="absolute left-[78%] top-0 h-full w-px bg-[#dce7e1]" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-[#dce7e1]" />
          </div>

          <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#809089]">
                Your home. Your choices.
              </p>

              <h3 className="mt-2 font-serif text-[23px] font-semibold tracking-[-0.025em] text-[#173d32]">
                From an idea to a plan you can see.
              </h3>
            </div>

            {/* Mini floor plan */}
            <div className="relative h-[76px] w-[155px] shrink-0 rounded-xl border border-[#cddbd4] bg-white p-2.5 shadow-sm">
              <div className="relative h-full w-full border border-[#9db8aa]">
                <div className="absolute left-[4%] top-[5%] h-[52%] w-[42%] border border-[#a9beb4]" />

                <div className="absolute right-[4%] top-[5%] h-[52%] w-[30%] border border-[#a9beb4]" />

                <div className="absolute bottom-[5%] left-[4%] h-[31%] w-[25%] border border-[#a9beb4]" />

                <div className="absolute bottom-[5%] left-[33%] h-[31%] w-[40%] border border-[#a9beb4]" />

                <div className="absolute bottom-[5%] right-[4%] h-[31%] w-[22%] border border-[#a9beb4]" />

                <div className="absolute left-[47%] top-[48%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b5d46]" />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#0b5d46] px-4 py-2.5 text-white shadow-[0_8px_20px_rgba(11,93,70,0.15)]">
              <Sparkles size={13} />
              <span className="text-[9px] font-bold uppercase tracking-[0.13em]">
                Smart planning
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}