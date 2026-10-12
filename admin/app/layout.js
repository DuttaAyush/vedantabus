import "./globals.css";

export const metadata = {
  title: "VedantaBus Admin Panel",
  description: "VedantaBus internal admin panel — fleet, bookings, packages & analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        "--font-inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "--font-playfair": "'Playfair Display', Georgia, serif",
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
