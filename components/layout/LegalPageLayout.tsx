import { getLegal } from "@/lib/content";

const legal = getLegal();

interface LegalPageLayoutProps {
  policyKey: "terms" | "privacy" | "refund" | "shipping";
}

export default function LegalPageLayout({ policyKey }: LegalPageLayoutProps) {
  const policy = legal[policyKey];

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {policy.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{legal.lastUpdated}</p>

        <div className="mt-10 space-y-8 text-muted leading-relaxed">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-white mb-3">
                {section.heading}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
