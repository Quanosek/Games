import { redirect } from "next/navigation";

import { auth } from "@/utils/auth";
import PageLayout from "@/components/wrappers/page-layout";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (user) return redirect("/");

  return <PageLayout>{children}</PageLayout>;
}
