import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(Facebook({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.role = "member";
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub || "oauth";
      session.user.role = token.role || "member";
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
