import './global.css';

export const metadata = {
  title: 'ҮгНэм — Хүртээмжтэй боловсрол',
  description: 'Унших, бичих чадварыг дэмжих хүртээмжтэй сургалтын платформ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
