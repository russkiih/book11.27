import { Inter } from 'next/font/google'
import './globals.css'
import { metadata } from './metadata'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
