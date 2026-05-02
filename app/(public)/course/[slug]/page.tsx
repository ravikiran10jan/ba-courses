import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase/admin";
import CourseHero from "@/components/course-detail/CourseHero";
import AtAGlance from "@/components/course-detail/AtAGlance";
import MethodologySteps from "@/components/course-detail/MethodologySteps";
import CurriculumSection from "@/components/course-detail/CurriculumSection";
import FAQSection from "@/components/course-detail/FAQSection";
import WhatsAppCTA from "@/components/course-detail/WhatsAppCTA";
import InstructorBio from "@/components/course-detail/InstructorBio";
import EnrollSection from "@/components/course-detail/EnrollSection";
import { getFallbackCourse, getPricing, getCourseDetail, getSite, getWhatYouGet } from "@/lib/content";
import type { Course, Lesson } from "@/types";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const fc = getFallbackCourse();
const pricing = getPricing();
const cd = getCourseDetail();
const site = getSite();
const wyg = getWhatYouGet();

// Build fallback course from content.yaml
const fallbackCourse: Course = {
  id: "ops-to-ba",
  title: fc.title,
  slug: fc.slug,
  description: fc.description,
  shortDescription: fc.description,
  category: fc.category,
  thumbnailUrl: "",
  previewVideoUrl: "",
  price: pricing.discounted,
  originalPrice: pricing.original,
  couponCode: "",
  couponDiscount: 0,
  enrolledCount: fc.enrolledCount,
  duration: fc.duration,
  language: fc.language,
  tooling: fc.tooling,
  timeRequirement: fc.timeRequirement,
  commitment: fc.duration,
  liveSessions: fc.liveSessions,
  certificateType: fc.certificate,
  instructors: [
    {
      name: fc.instructor.name,
      title: fc.instructor.title,
      imageUrl: "",
      linkedinUrl: "https://www.linkedin.com/in/ravikiranreddyg",
      bio: fc.instructor.bio,
    },
  ],
  testimonials: [],
  whatYouGet: wyg.items as unknown as string[],
  bonuses: fc.bonuses as unknown as string[],
  faqs: fc.faqs,
  whatsappLink: site.contact.whatsapp,
  isPublished: true,
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const fallbackWeeks = fc.weeks.map((week, i) => ({
  weekNumber: i + 1,
  title: week.title,
  lessons: week.lessons.map((lessonTitle, j) => ({
    id: `${String.fromCharCode(97 + i)}${j + 1}`,
    courseId: "ops-to-ba",
    weekNumber: i + 1,
    title: lessonTitle,
    videoPath: "",
    duration: 3600,
    order: j + 1,
    isPreview: i === 0 && j === 0,
    createdAt: new Date(),
  })),
}));

interface CourseWeek {
  weekNumber: number;
  title: string;
  lessons: Lesson[];
}

async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const snapshot = await adminDb
      .collection("courses")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Course;
  } catch {
    return null;
  }
}

async function getLessonsForCourse(courseId: string): Promise<Lesson[]> {
  try {
    const snapshot = await adminDb
      .collection("lessons")
      .where("courseId", "==", courseId)
      .orderBy("weekNumber", "asc")
      .orderBy("order", "asc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      } as Lesson;
    });
  } catch {
    return [];
  }
}

function groupLessonsByWeek(lessons: Lesson[]): CourseWeek[] {
  const weekMap = new Map<number, Lesson[]>();

  for (const lesson of lessons) {
    const week = lesson.weekNumber || 1;
    if (!weekMap.has(week)) {
      weekMap.set(week, []);
    }
    weekMap.get(week)!.push(lesson);
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekNumber, weekLessons]) => ({
      weekNumber,
      title: `${cd.weekPrefix} ${weekNumber}`,
      lessons: weekLessons,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (course) {
    return {
      title: course.title,
      description: course.shortDescription,
    };
  }

  if (slug === fc.slug) {
    return {
      title: fallbackCourse.title,
      description: fallbackCourse.shortDescription,
    };
  }

  return { title: cd.notFoundTitle };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let course = await getCourseBySlug(slug);
  let weeks: CourseWeek[] = [];

  if (course) {
    const lessons = await getLessonsForCourse(course.id);
    weeks = groupLessonsByWeek(lessons);
  } else if (slug === fc.slug) {
    course = fallbackCourse;
    weeks = fallbackWeeks;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-3xl font-black mb-4">{cd.notFoundTitle}</h1>
        <p className="text-muted mb-8">{cd.notFoundDescription}</p>
        <Link href="/">
          <Button variant="primary">{cd.notFoundCta}</Button>
        </Link>
      </div>
    );
  }

  const glanceItems = fc.glanceItems.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <>
      <CourseHero
        title={course.title}
        enrolledCount={course.enrolledCount}
        price={course.price}
        originalPrice={course.originalPrice}
        couponCode={course.couponCode || ""}
        slug={course.slug}
      />
      <AtAGlance items={glanceItems} />
      <MethodologySteps />
      {weeks.length > 0 && <CurriculumSection weeks={weeks} />}
      {(course.instructors || []).map((instructor) => (
        <InstructorBio key={instructor.name} instructor={instructor} />
      ))}
      <EnrollSection courseId={course.id} courseTitle={course.title} price={course.price} originalPrice={course.originalPrice} />
      {(course.faqs || []).length > 0 && <FAQSection faqs={course.faqs} />}
      {course.whatsappLink && <WhatsAppCTA whatsappLink={course.whatsappLink} />}
    </>
  );
}
