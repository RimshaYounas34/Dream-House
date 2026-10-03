import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bath,
  Layers3,
  Sparkles,
} from "lucide-react";

import { templates } from "../../pages/Templates";

import modernVillaImage from "../../assets/templates/modern-villa.jpeg";
import familyHouseImage from "../../assets/templates/family-house.jpg";
import luxuryVillaImage from "../../assets/templates/luxury-villa.jpg";
import minimalHouseImage from "../../assets/templates/minimal-house.jpg";

const templateImages = {
  1: modernVillaImage,
  2: familyHouseImage,
  3: luxuryVillaImage,
  4: minimalHouseImage,
};

export default function Templates() {
  const navigate = useNavigate();

  const featuredTemplates = templates.slice(0, 4);

  const openTemplate = (template) => {
    navigate("/floor-plan-editor", {
      state: {
        source: "template",
        templateId: template.id,
        templateName: template.name,
        rooms: template.rooms,
        plotWidth: Number(template.plot.split("×")[0]),
        plotLength: Number(
          template.plot.split("×")[1]?.replace("ft", "").trim()
        ),
        floors: template.floors,
        requirementsText: `${template.name}: ${template.bedrooms} bedrooms, ${template.bathrooms} bathrooms, ${template.kitchens} kitchen`,
        style: template.category,
        generatedByAI: false,
        fromTemplate: true,
      },
    });
  };

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#f8f6ef] py-24 sm:py-28 lg:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#dfece5]/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-[#eee7d8]/70 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-6 sm:px-10 lg:px-14 xl:px-20">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-7 lg:mb-14 lg:flex-row lg:items-end">
          <div className="max-w-[680px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#08724f]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#08724f]">
                House Templates
              </span>
            </div>

            <h2 className="font-serif text-[42px] font-medium leading-[1.05] tracking-[-0.04em] text-[#17342c] sm:text-[50px] lg:text-[58px]">
              Start with a plan.
              <br />
              <span className="text-[#08724f]">Make it your own.</span>
            </h2>

            <p className="mt-5 max-w-[590px] text-[15px] leading-7 text-[#66766f] sm:text-[16px]">
              Choose a professionally planned house layout and customize it
              according to your space, family and lifestyle.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/templates")}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#cbd9d2] bg-white px-5 py-3 text-[13px] font-bold text-[#17342c] shadow-sm transition-all duration-300 hover:border-[#08724f] hover:bg-[#08724f] hover:text-white"
          >
            View All Templates
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Templates — exactly 4 in one row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredTemplates.map((template, index) => {
            const image = templateImages[template.id];

            return (
              <article
                key={template.id}
                onClick={() => openTemplate(template)}
                className="group cursor-pointer overflow-hidden rounded-[26px] border border-[#e3e6df] bg-white shadow-[0_12px_35px_rgba(23,52,44,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(23,52,44,0.13)]"
              >
                {/* Image */}
                <div className="relative h-[280px] overflow-hidden">
                  <img
                    src={image}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102b24]/75 via-transparent to-transparent opacity-80" />

                  {/* Category */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#08724f] backdrop-blur-md">
                      {template.category}
                    </span>
                  </div>

                  {/* Open icon */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#17342c] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </div>

                  {/* Bottom image information */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b8d8c8]" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                        {template.plot}
                      </span>
                    </div>

                    <h3 className="font-serif text-[25px] font-medium leading-tight">
                      {template.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-5 flex items-center justify-between border-b border-[#edf0eb] pb-4">
                    <div className="flex items-center gap-1.5 text-[#69766f]">
                      <BedDouble size={15} className="text-[#08724f]" />
                      <span className="text-[12px] font-semibold">
                        {template.bedrooms} Beds
                      </span>
                    </div>

                    <div className="h-4 w-px bg-[#dfe5e0]" />

                    <div className="flex items-center gap-1.5 text-[#69766f]">
                      <Bath size={15} className="text-[#08724f]" />
                      <span className="text-[12px] font-semibold">
                        {template.bathrooms} Baths
                      </span>
                    </div>

                    <div className="h-4 w-px bg-[#dfe5e0]" />

                    <div className="flex items-center gap-1.5 text-[#69766f]">
                      <Layers3 size={15} className="text-[#08724f]" />
                      <span className="text-[12px] font-semibold">
                        {template.floors} Floor
                        {template.floors > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTemplate(template);
                    }}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#08724f] text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(8,114,79,0.15)] transition-all duration-300 hover:bg-[#065d40] hover:shadow-[0_12px_25px_rgba(8,114,79,0.22)]"
                  >
                    <Sparkles size={14} className="text-white" />
                    <span className="text-white">Use This Template</span>
                    <ArrowRight
                      size={14}
                      className="text-white transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[24px] bg-[#173d32] px-7 py-7 sm:flex-row sm:px-9">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Sparkles size={19} className="text-[#d8e9df]" />
            </div>

            <div>
              <p className="text-[14px] font-bold text-white">
                Want to design from scratch?
              </p>
              <p className="mt-1 text-[12px] text-white/60">
                Create your own floor plan with complete control.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/floor-plan-editor")}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-[12px] font-bold text-[#173d32] transition-all duration-300 hover:bg-[#edf6f1]"
          >
            Start From Scratch
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}