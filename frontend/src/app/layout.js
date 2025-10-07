import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "MyRequest.com",
  description: "Make a request",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
