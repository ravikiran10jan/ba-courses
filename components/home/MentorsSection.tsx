import Card from "@/components/ui/Card";
import { getTrainer } from "@/lib/content";

const trainer = getTrainer();

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function MentorsSection() {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-4">
          {trainer.sectionHeading}
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          {trainer.sectionSubheading}
        </p>

        <div className="flex justify-center">
          <Card hover className="text-center max-w-sm w-full">
            {/* Placeholder avatar */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-4">
              <span className="text-3xl font-black text-accent">
                {trainer.name.charAt(0)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
            <p className="text-sm text-accent mt-1">{trainer.title}</p>
            <p className="text-sm text-muted mt-3 leading-relaxed">{trainer.bio}</p>

            {/* Experience badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {trainer.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-accent/10 border border-accent/20 rounded text-xs font-semibold text-accent"
                >
                  {badge}
                </span>
              ))}
            </div>

            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              <LinkedinIcon />
              {trainer.linkedinLabel}
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}
