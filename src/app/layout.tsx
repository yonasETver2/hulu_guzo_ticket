import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import { Providers } from "./providers"; // 👈 import the wrapper

export const metadata = {
  title: "hulu_guzo_ticket",
  description:
    "This application is designed for ticket offices to efficiently manage ticketing operations for all regional bus services. It enables ticket agents to view schedules, manage seat availability, process bookings, and coordinate trips across multiple transport providers from a single centralized system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pb-3">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
