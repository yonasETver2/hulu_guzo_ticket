import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, userType } = credentials;

        try {
          const results: any = await query("CALL checkUserMatchUser(?, ?)", [
            email,
            userType,
          ]);

          const user = results[0][0];
          if (!user) return null;

          const isMatch = await bcrypt.compare(password, user.usr_password);
          if (!isMatch) return null;

          return {
            id: user.sign_up_id,
            name: user.user_name,
            email: user.email_adress,
            user_type: user.user_type,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT & { user?: any };
      user?: any;
    }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },

  pages: {
    signIn: "/pages/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
