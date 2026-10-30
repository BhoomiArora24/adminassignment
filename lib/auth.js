import CredentialsProvider from "next-auth/providers/credentials";

// Server-only. Calls DummyJSON; the refresh token is deliberately never forwarded to the session.
export const authOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "DummyJSON",
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        let res;
        try {
          res = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials?.username, password: credentials?.password, expiresInMins: 60 }),
          });
        } catch {
          throw new Error("NetworkError");
        }
        if (!res.ok) return null;
        const d = await res.json();
        return { id: String(d.id), name: `${d.firstName} ${d.lastName}`, email: d.email, image: d.image, username: d.username, accessToken: d.accessToken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.accessToken = user.accessToken; token.username = user.username; }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.username = token.username;
      return session;
    },
  },
};
