import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0, "Original price must be positive"),
  duration: z.string(),
  isPublished: z.boolean(),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Title is required"),
  weekNumber: z.number().min(1, "Week number is required"),
  order: z.number().min(1, "Order is required"),
  isPreview: z.boolean(),
});

export const enterpriseDemoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  teamSize: z.string(),
  message: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type EnterpriseDemoFormData = z.infer<typeof enterpriseDemoSchema>;
