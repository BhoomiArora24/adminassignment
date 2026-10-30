import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardShell from "@/components/layout/DashboardShell";
export default async function DashboardLayout({ children }) {
  // Second line of defence behind middleware: validate the session on the server.
  if (!(await getServerSession(authOptions))) redirect("/login");
  return <DashboardShell>{children}</DashboardShell>;
}
