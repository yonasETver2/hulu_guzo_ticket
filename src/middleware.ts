import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware"; // Ensure you're using withAuth

// Export the middleware function directly
export { withAuth as middleware };

// Your matcher configuration
export const config = {
  matcher: ["/pages/about/:path*"], // Protect paths under /pages/about
};
