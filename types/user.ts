export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  avatarUrl: string;
  role: "user" | "admin";
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  name: string;
  phone: string;
  country: string;
}
