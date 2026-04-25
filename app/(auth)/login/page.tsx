import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Spinner from "@/components/ui/Spinner";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
