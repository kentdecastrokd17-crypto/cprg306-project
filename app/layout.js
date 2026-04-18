import "./globals.css";
import { SessionProvider } from "@/providers/SessionProvider";

export const metadata = {
  title: "KidBrowse",
  description: "A safe web browser for children aged 4–12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-sky-50 text-gray-800 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
