import '../styles/globals.css'
import Navbar from "./navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className="bg-gray-200 min-h-screen p-5">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
