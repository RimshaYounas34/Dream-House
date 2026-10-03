import { Quote, Star, ArrowUpRight } from "lucide-react";

import ayeshaImage from "../../assets/testimonials/ayesha.jpg";
import usmanImage from "../../assets/testimonials/usman.jpg";
import saraImage from "../../assets/testimonials/sara.jpg";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Homeowner",
    quote:
      "I finally understood how all my rooms could fit together before speaking to a builder.",
    image: ayeshaImage,
  },
  {
    name: "Usman Raza",
    role: "Designer",
    quote:
      "The 2D editor makes it easy to test different layouts without starting over.",
    image: usmanImage,
  },
  {
    name: "Sara Ahmed",
    role: "Homeowner",
    quote:
      "Being able to move from a floor plan to a 3D view makes the idea feel much more real.",
    image: saraImage,
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf5] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[300px] w-[300px] rounded-full bg-[#edf5ef] blur-3xl opacity-70" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-[320px] w-[320px] rounded-full bg-[#f1eadc] blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-[1280px]">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center text-center">

          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#08724f]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#08724f]">
              Real Experiences
            </p>

            <span className="h-[2px] w-8 bg-[#08724f]" />
          </div>

          <h2 className="max-w-[720px] font-serif text-[42px] font-medium leading-[1.05] tracking-[-0.045em] text-[#183b31] sm:text-[52px] lg:text-[58px]">
            Designed for
            <span className="text-[#08724f]"> real people.</span>
          </h2>

          <p className="mt-4 max-w-[570px] text-[14px] leading-7 text-[#707a74] sm:text-[15px]">
            See how homeowners and designers use DreamHouse to turn ideas
            into clear, confident home plans.
          </p>

        </div>

        {/* ================= TESTIMONIAL CARDS ================= */}
        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-14">

          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-[25px] border border-[#dce4de] bg-white p-6 shadow-[0_10px_35px_rgba(23,61,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8d9d0] hover:shadow-[0_20px_45px_rgba(23,61,50,0.10)] sm:p-7"
            >

              {/* Top row */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3.5">

                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[52px] w-[52px] rounded-[16px] object-cover ring-4 ring-[#f2f6f2]"
                    />

                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#08724f]">
                      <span className="text-[9px] font-bold text-white">
                        ✓
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[14px] font-bold text-[#24483c]">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#87928c]">
                      {item.role}
                    </p>
                  </div>

                </div>

                {/* Quote icon */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5f0] text-[#08724f]">
                  <Quote size={16} />
                </div>

              </div>

              {/* Stars */}
              <div className="mt-6 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    fill="currentColor"
                    className="text-[#08724f]"
                  />
                ))}

                <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa49f]">
                  Experience
                </span>
              </div>

              {/* Quote */}
              <p className="mt-5 font-serif text-[18px] leading-[1.65] text-[#36564b]">
                “{item.quote}”
              </p>

              {/* Bottom */}
              <div className="mt-auto flex items-center justify-between border-t border-[#edf0ec] pt-5">

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#08724f]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a958f]">
                    DreamHouse User
                  </span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dce6df] text-[#7e8c85] transition-all duration-300 group-hover:border-[#08724f] group-hover:bg-[#08724f] group-hover:text-white">
                  <ArrowUpRight size={14} />
                </div>

              </div>

              {/* Card number */}
              <span className="pointer-events-none absolute -bottom-5 -right-2 font-serif text-[90px] font-medium leading-none text-[#08724f]/[0.035]">
                0{index + 1}
              </span>

            </article>
          ))}

        </div>

        {/* ================= BOTTOM TRUST STRIP ================= */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#dfe6e0] bg-white/70 px-5 py-4 sm:flex-row sm:px-6">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f2ec]">
              <Star
                size={15}
                fill="currentColor"
                className="text-[#08724f]"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold text-[#315348]">
                Loved by homeowners & designers
              </p>

              <p className="text-[9px] text-[#8a958f]">
                Simple planning. Clear visualization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div>
              <p className="font-serif text-[21px] font-medium text-[#183b31]">
                4.9/5
              </p>
            </div>

            <div className="h-8 w-px bg-[#dfe6e0]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#7d8983]">
              User Experience
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}