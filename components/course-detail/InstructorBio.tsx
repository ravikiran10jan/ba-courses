import type { Instructor } from "@/types";
import { getCourseDetail } from "@/lib/content";

const cd = getCourseDetail();

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

interface InstructorBioProps {
  instructor: Instructor;
}

export default function InstructorBio({ instructor }: InstructorBioProps) {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            {instructor.imageUrl ? (
              <img
                src={instructor.imageUrl}
                alt={instructor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
                <span className="text-3xl font-black text-accent">
                  {instructor.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-white">
              {instructor.name}
            </h3>
            <p className="text-sm text-accent mt-1">{instructor.title}</p>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              {instructor.bio}
            </p>
            {instructor.linkedinUrl && (
              <a
                href={instructor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <LinkedinIcon />
                {cd.instructorLinkedin}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
