import Providers from "@/components/Providers";
export const metadata = { title: "Admin Dashboard", description: "Users and products admin built on DummyJSON" };
export default function RootLayout({ children }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
