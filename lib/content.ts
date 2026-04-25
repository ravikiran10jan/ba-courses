// Re-exports content from the auto-generated file.
// Source of truth: content.yaml  →  npm run content:generate  →  content.generated.ts

import content from "./content.generated";

export default content;

/* ---------- Typed helpers for common sections ---------- */

export interface SiteContent {
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  url: string;
  contact: {
    phone: string;
    phoneRaw: string;
    email: string;
    discord: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

export interface CurriculumPillar {
  tag: string;
  title: string;
  items: string[];
}

export interface OpportunityCard {
  tag: string;
  title: string;
  description: string;
}

export interface MarketDemandPoint {
  title: string;
  description: string;
}

export interface MethodologyStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface FallbackWeek {
  title: string;
  lessons: string[];
}

export interface GlanceItem {
  label: string;
  value: string;
}

export function getSite(): SiteContent {
  return content.site as unknown as SiteContent;
}

export function getPricing(): { original: number; discounted: number } {
  return content.pricing as unknown as { original: number; discounted: number };
}

export function getStats(): { heading: string; items: StatItem[] } {
  return content.stats as unknown as { heading: string; items: StatItem[] };
}

export function getHero() {
  return content.hero as unknown as {
    tagline: string;
    headlineTop: string;
    headlineAccent: string;
    subheadline: string;
    badgeLeft: string;
    badgeArrow: string;
    badgeRight: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaDashboard: string;
  };
}

export function getMarketDemand() {
  return content.marketDemand as unknown as {
    tagline: string;
    bigNumber: string;
    bigLabel: string;
    points: MarketDemandPoint[];
  };
}

export function getCourseGrid() {
  return content.courseGrid as unknown as { heading: string; subheading: string };
}

export function getFeaturedCourse() {
  const fc = content.featuredCourse;
  const pricing = getPricing();
  return {
    id: fc.id,
    title: fc.title,
    slug: fc.slug,
    category: fc.category,
    enrolledCount: fc.enrolledCount,
    duration: fc.duration,
    price: pricing.discounted,
    originalPrice: pricing.original,
    thumbnailUrl: "",
  };
}

export function getCurriculum() {
  return content.curriculum as unknown as {
    tagline: string;
    heading: string;
    pillars: CurriculumPillar[];
  };
}

export function getWhyThisOpportunity() {
  return content.whyThisOpportunity as unknown as {
    heading: string;
    subheading: string;
    cards: OpportunityCard[];
  };
}

export function getWhoIsThisFor() {
  return content.whoIsThisFor as unknown as {
    heading: string;
    subheading: string;
    badges: string[];
  };
}

export function getTestimonials() {
  return content.testimonials as unknown as {
    heading: string;
    subheading: string;
    items: TestimonialItem[];
  };
}

export function getTrainer() {
  return content.trainer as unknown as {
    sectionHeading: string;
    sectionSubheading: string;
    name: string;
    title: string;
    bio: string;
    badges: string[];
    linkedinLabel: string;
  };
}

export function getWhatYouGet() {
  return content.whatYouGet as unknown as {
    tagline: string;
    priceLabel: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    newsletterSuccess: string;
    items: string[];
  };
}

export function getStillHaveQuestions() {
  return content.stillHaveQuestions as unknown as {
    heading: string;
    description: string;
    cta: string;
  };
}

export function getNavbar() {
  return content.navbar as unknown as {
    logo: string;
    login: string;
    signup: string;
    signupMobile: string;
    dashboard: string;
  };
}

export function getFooter() {
  return content.footer as unknown as { brand: string; copyright: string; phoneLabel: string; emailLabel: string };
}

export function getCourseCard() {
  return content.courseCard as unknown as {
    thumbnailAlt: string;
    cta: string;
    aspirantsSuffix: string;
  };
}

export function getCourseDetail() {
  return content.courseDetail as unknown as Record<string, string>;
}

export function getMethodology() {
  return content.methodology as unknown as {
    heading: string;
    steps: MethodologyStep[];
  };
}

export function getContactModal() {
  return content.contactModal as unknown as Record<string, string>;
}

export function getContactPage() {
  return content.contactPage as unknown as {
    heading: string;
    subheading: string;
    phoneLabel: string;
    emailLabel: string;
    discordLabel: string;
    discordCta: string;
    twitterLabel: string;
    twitterHandle: string;
    whyReachOut: { heading: string; reasons: string[] };
  };
}

export function getCoupon() {
  return content.coupon as unknown as Record<string, string>;
}

export function getPayment() {
  return content.payment as unknown as Record<string, string>;
}

export function getPaymentVerify() {
  return content.paymentVerify as unknown as Record<string, string>;
}

export function getFallbackCourse() {
  return content.fallbackCourse as unknown as {
    title: string;
    slug: string;
    description: string;
    category: string;
    language: string;
    tooling: string;
    timeRequirement: string;
    duration: string;
    liveSessions: string;
    certificate: string;
    enrolledCount: number;
    instructor: { name: string; title: string; bio: string };
    faqs: FaqItem[];
    weeks: FallbackWeek[];
    glanceItems: GlanceItem[];
    bonuses: string[];
  };
}

export function getLegal() {
  return content.legal as unknown as {
    lastUpdated: string;
    contactEmail: string;
    terms: { title: string; sections: LegalSection[] };
    privacy: { title: string; sections: LegalSection[] };
    refund: { title: string; sections: LegalSection[] };
    shipping: { title: string; sections: LegalSection[] };
  };
}

export function getMetadata() {
  return content.metadata as unknown as {
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
}

/* ---------- New section helpers ---------- */

export interface NavLink {
  href: string;
  label: string;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
}

export function getNavigation() {
  return content.navigation as unknown as {
    publicLinks: NavLink[];
    userMenu: NavLink[];
    footerLinks: NavLink[];
    adminNav: AdminNavItem[];
  };
}

export function getAuthForms() {
  return content.authForms as unknown as {
    tagline: string;
    showPassword: string;
    hidePassword: string;
    login: {
      heading: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      rememberMe: string;
      forgotPassword: string;
      submitButton: string;
      or: string;
      noAccount: string;
      signUpLink: string;
      errorFallback: string;
    };
    signup: {
      heading: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submitButton: string;
      or: string;
      hasAccount: string;
      logInLink: string;
      errorFallback: string;
    };
    google: { button: string };
    forgotPassword: {
      title: string;
      description: string;
      emailLabel: string;
      emailPlaceholder: string;
      submitButton: string;
      successMessage: string;
      errorFallback: string;
    };
  };
}

export function getNotFound() {
  return content.notFound as unknown as {
    code: string;
    message: string;
    cta: string;
  };
}

export function getDashboard() {
  return content.dashboard as unknown as {
    tagline: string;
    heading: string;
    enrolledTab: string;
    completedTab: string;
    noEnrolled: string;
    noCompleted: string;
    backHome: string;
  };
}

export function getProfile() {
  return content.profile as unknown as Record<string, string>;
}

export function getPaymentHistory() {
  return content.paymentHistory as unknown as {
    heading: string;
    empty: string;
    priceLabel: string;
    dateLabel: string;
    statusLabel: string;
  };
}

export function getAdmin() {
  return content.admin as unknown as {
    dashboard: {
      heading: string;
      totalUsers: string;
      totalCourses: string;
      totalRevenue: string;
      activeEnrollments: string;
    };
    courses: Record<string, string>;
    lessons: Record<string, string>;
    students: Record<string, string>;
    payments: Record<string, string>;
  };
}

export interface EnterpriseTestimonial {
  name: string;
  role: string;
  rating: number;
  review: string;
}

export interface EnterpriseFaqItem {
  title: string;
  content: string;
}

export function getEnterprise() {
  return content.enterprise as unknown as {
    hero: { heading: string; benefits: string[]; cta: string };
    trustedPartners: { heading: string; partners: string[] };
    departmentGrid: { heading: string; departments: string[] };
    testimonials: { heading: string; items: EnterpriseTestimonial[] };
    faq: { heading: string; items: EnterpriseFaqItem[] };
    pageDescription: string;
  };
}

export function getCoursePlayer() {
  return content.coursePlayer as unknown as {
    signInMessage: string;
    courseNotFound: string;
    signInButton: string;
    notEnrolledMessage: string;
    viewCourseDetails: string;
    backToHome: string;
    congratsMessage: string;
    viewAchievements: string;
    markAsComplete: string;
    lessonCompleted: string;
  };
}

export function getAchievement() {
  return content.achievement as unknown as {
    heading: string;
    emptyTitle: string;
    emptyMessage: string;
    courseCompletion: string;
    viewCertificate: string;
  };
}

export function getReferral() {
  return content.referral as unknown as {
    heading: string;
    totalEarned: string;
    totalClaimed: string;
    totalClaimable: string;
    emptyMessage: string;
    total: string;
    claimed: string;
    claimable: string;
    viewMore: string;
  };
}

export function getAdminForms() {
  return content.adminForms as unknown as {
    courseForm: Record<string, string>;
    lessonForm: Record<string, string>;
    dataTable: Record<string, string>;
  };
}

export function getAdminPages() {
  return content.adminPages as unknown as {
    newCourse: { heading: string; createFailed: string };
    editCourse: { heading: string; notFound: string; updateFailed: string };
  };
}

export function getDashboardComponents() {
  return content.dashboardComponents as unknown as {
    courseCard: { noThumbnail: string; reviewCourse: string; continueLearning: string };
    certificateModal: { printCertificate: string; downloadPdf: string };
    referralLink: { heading: string; copied: string; copyLink: string };
  };
}

export function getPlayerComponents() {
  return content.playerComponents as unknown as {
    videoPlayer: { selectLesson: string; videoUnavailable: string; tryAgainMessage: string };
    lessonSidebar: { lessonsCompleted: string; weekPrefix: string };
  };
}

export function getAdminSidebar() {
  return content.adminSidebar as unknown as {
    brandName: string;
    adminPanel: string;
    backToSite: string;
  };
}

export function getUserDropdown() {
  return content.userDropdown as unknown as {
    logOut: string;
  };
}
