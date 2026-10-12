import "./globals.css";

export const metadata = {
  title: "VedantaBus - India's Dedicated Intercity Bus & Curated Travel Packages",
  description:
    "Book luxury BharatBenz & Volvo sleeper coaches, spiritual yatra packages, international holidays, and curated India travel experiences. Direct fleet operator — 0% convenience markup.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth"
      style={{
        "--font-inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "--font-playfair": "'Playfair Display', Georgia, serif",
        "--font-spiritual": "'Marcellus', 'Cinzel', serif",
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800&family=Marcellus&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-slate-800 antialiased selection:bg-red-600 selection:text-white overflow-x-clip min-h-screen relative">
        {children}
      </body>
    </html>
  );
}
