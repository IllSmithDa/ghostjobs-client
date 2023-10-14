import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './component/Navbar/Navbar'
import ReduxProvider from './component/redux/ReduxProvider'
import ComponentModal from './component/ComponentModal/ComponentModal'
import userFetch from './component/Auth/UserFetch'
import UserFetch from './component/Auth/UserFetch'
import Script from 'next/script'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GhostedOn',
  description: 'Share your work stories anonymously',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <ReduxProvider>
      <html lang="en">
        <Script 
          id="Absense-banner"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2907367619848104"
          crossOrigin="anonymous"
        />
        <body className={inter.className}>
            <ComponentModal />
            <UserFetch>
              <Navbar/>
              <div style={{ marginTop: 52 }}></div>
              {children}
            </UserFetch>
        </body>
      </html>
    </ReduxProvider>
  )
}

