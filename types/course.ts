export interface Instructor {
  name: string;
  title: string;
  imageUrl: string;
  linkedinUrl: string;
  bio: string;
}

export interface Testimonial {
  name: string;
  text: string;
  achievement: string;
  amount: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  price: number;
  originalPrice: number;
  couponCode: string;
  couponDiscount: number;
  enrolledCount: number;
  duration: string;
  language: string;
  tooling: string;
  timeRequirement: string;
  commitment: string;
  liveSessions: string;
  certificateType: string;
  instructors: Instructor[];
  testimonials: Testimonial[];
  whatYouGet: string[];
  bonuses: string[];
  faqs: FAQ[];
  whatsappLink: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  videoPath: string;
  duration: number;
  order: number;
  isPreview: boolean;
  createdAt: Date;
}

export interface Week {
  weekNumber: number;
  title: string;
  lessons: Lesson[];
}

export interface CourseWithCurriculum extends Course {
  weeks: Week[];
}
