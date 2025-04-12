"use client"

import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "@/context/AuthContext"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "@/global.css"
import Background from "@/components/ui/bg"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Provider>
          <AuthProvider>
            <Background />
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}