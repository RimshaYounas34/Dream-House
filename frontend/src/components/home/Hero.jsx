import { Link } from "react-router-dom";

const houseImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90";

const interiorImage =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=85";

function MiniPlan() {
  return (
    <div className="absolute -left-12 bottom-8 hidden w-60 rounded-2xl border border-[#d8ddd5] bg-[#fbfaf5] p-4 shadow-xl lg:block">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#24483c]">2D Floor Plan</span>
        <span className="rounded-full bg-[#e8eee5] px-2 py-1 text-[9px] font-semibold text-[#0b5d46]">2D</span>
      </div>
      <div className="grid h-32 grid-cols-4 grid-rows-3 gap-1.5 border-2 border-[#34594d] bg-white p-1.5">
        <div className="col-span-2 row-span-2 flex items-center justify-center border border-[#6f887d] text-[9px] text-[#6f887d]">Living</div>
        <div className="flex items-center justify-center border border-[#6f887d] text-[8px] text-[#6f887d]">Bed</div>
        <div className="flex items-center justify-center border border-[#6f887d] text-[8px] text-[#6f887d]">Bath</div>
        <div className="flex items-center justify-center border border-[#6f887d] text-[8px] text-[#6f887d]">Kitchen</div>
        <div className="col-span-2 flex items-center justify-center border border-[#6f887d] text-[8px] text-[#6f887d]">Dining</div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[820px] overflow-hidden bg-[#f8f5eb]">
      <div className="mx-auto grid min-h-[820px] max-w-[1280px] items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8ddd5] bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#668074]">
            AI-powered home planning
          </div>

          <h1 className="max-w-[650px] font-serif text-[48px] font-semibold leading-[0.98] tracking-[-0.045em] text-[#183b31] sm:text-[58px] lg:text-[64px]">
            Design your dream home,
            <span className="block text-[#0b5d46]">room by room.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[14px] leading-7 text-[#69736d] sm:text-[15px]">
            Turn your ideas into beautiful floor plans with AI. Create, edit,
            visualize and save your complete home design in one simple place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
  to="/design-method"
  className="rounded-full bg-[#0b5d46] px-6 py-3.5 text-[11px] font-bold text-white transition hover:bg-[#174c3d]"
>
  Start Designing →
</Link>
            <a href="#templates" className="rounded-full border border-[#cbd4cc] bg-white/60 px-7 py-3.5 text-[12px] font-semibold text-[#315348]">
              Explore Templates
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-8">
            <div>
              <p className="font-serif text-2xl font-semibold text-[#183b31]">2D + 3D</p>
              <p className="mt-1 text-[11px] text-[#7a827d]">Visual planning</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-[#183b31]">AI</p>
              <p className="mt-1 text-[11px] text-[#7a827d]">Smart suggestions</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-[#183b31]">Easy</p>
              <p className="mt-1 text-[11px] text-[#7a827d]">No CAD skills</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] lg:mt-8">
          <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white p-3 shadow-2xl shadow-[#315348]/15">
            <img src={houseImage} alt="Modern dream house" className="h-[500px] w-full rounded-[27px] object-cover sm:h-[570px]" />
            <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/70 bg-white/90 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#819087]">Modern Residence</p>
                  <p className="mt-1 font-serif text-xl font-semibold text-[#183b31]">Your plan, beautifully visualized.</p>
                </div>
                <img src={interiorImage} alt="Modern interior" className="h-14 w-20 rounded-xl object-cover" />
              </div>
            </div>
          </div>

          <MiniPlan />

          <div className="absolute -right-5 top-12 hidden w-48 rounded-2xl border border-[#d8ddd5] bg-[#fbfaf5] p-4 shadow-xl sm:block">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dfece5] text-lg">✦</div>
              <p className="text-[12px] font-bold text-[#24483c]">AI Assistant</p>
            </div>
            <p className="text-[11px] leading-5 text-[#707a74]">Try adding a larger kitchen beside the dining area.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
