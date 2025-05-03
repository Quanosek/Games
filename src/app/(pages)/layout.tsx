import PageLayout from "@/components/wrappers/page-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
