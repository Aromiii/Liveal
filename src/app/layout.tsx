import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className="bg-gray-200 min-h-screen p-5">
        {children}
      </body>
    </html>
  )
}
