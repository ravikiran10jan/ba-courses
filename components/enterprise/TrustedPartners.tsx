import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

export default function TrustedPartners() {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-10">
          {ent.trustedPartners.heading}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {ent.trustedPartners.partners.map((partner) => (
            <div
              key={partner}
              className="px-6 py-3 bg-background border border-card-border rounded-lg text-sm font-bold text-white hover:border-accent hover:text-accent transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
