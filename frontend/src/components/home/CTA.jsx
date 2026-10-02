import { Link } from "react-router-dom";

const image =
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=90";

export default function CTA() {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[36px] bg-[#0b5d46]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-[#0b5d46]/75" />
        <div className="relative px-7 py-16 text-center sm:px-12 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c7d9ce]">Your dream starts here</p>
          <h2 className="mx-auto mt-4 max-w-[720px] font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Ready to design a home that feels like yours?
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] text-[14px] leading-7 text-[#dce9e2]">
            Start with your plot dimensions and let DreamHouse Planner turn your ideas into a clear, editable plan.
          </p>
          <Link to="/create-project" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-[12px] font-bold text-[#0b5d46]">
            Create Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}
