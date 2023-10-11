import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './component/Navbar/Navbar'
import ReduxProvider from './component/redux/ReduxProvider'
import ComponentModal from './component/ComponentModal/ComponentModal'
import userFetch from './component/Auth/UserFetch'
import UserFetch from './component/Auth/UserFetch'
import { GoogleOAuthProvider } from '@react-oauth/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GhostOn',
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

