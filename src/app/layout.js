import "./globals.css";

export const metadata = {
  title: "Khushi Jain — Full-Stack Product Builder",
  description: "Khushi turns messy product problems into thoughtful, working software through product thinking, design and full-stack development.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

