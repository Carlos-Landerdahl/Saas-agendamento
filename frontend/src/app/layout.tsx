export const metadata = {
  title: 'Agendamentos',
  description: 'Gestão de agendamentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ptbr">
      <body>{children}</body>
    </html>
  )
}
