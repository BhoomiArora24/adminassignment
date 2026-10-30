import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";
export default async function LoginPage() {
  if (await getServerSession(authOptions)) redirect("/dashboard");
  return <LoginForm />;
}
