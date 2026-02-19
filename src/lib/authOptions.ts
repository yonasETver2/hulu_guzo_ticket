// src/lib/authOptions.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db"; // your database helper
import bcrypt from "bcryptjs";

// ------------------------
// Extend NextAuth types
// ------------------------
declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number;
    userType?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | number;
      name?: string;
      email?: string;
      userType?: string;
    };
  }

  interface User {
    id?: string | number;
    userType?: string;
  }
}

// ------------------------
// NextAuth options
// ------------------------
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, userType } = credentials;
        if (!email || !password || !userType) return null;

        try {
          // Fetch user from database
          const result = await query(
            `SELECT * FROM checkUserMatchUser($1, $2)`,
            [email, userType]
          );

          const user = result.rows?.[0];
          if (!user) return null;

          // Compare password if stored as hash
          const isValidPassword = await bcrypt.compare(password, user.usr_password);
          if (!isValidPassword) return null;

          // Return user object for NextAuth
          return {
            id: user.sign_up_id,
            name: user.user_name,
            email: user.email_adress,
            userType: user.user_type,
          };
        } catch (err: unknown) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.userType) session.user.userType = token.userType;
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
