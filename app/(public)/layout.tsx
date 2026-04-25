import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StillHaveQuestions from "@/components/home/StillHaveQuestions";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <StillHaveQuestions />
      <Footer />
    </>
  );
}
