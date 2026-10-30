// Edge-level route protection: unauthenticated requests to /dashboard/* are redirected to /login.
export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*"] };
