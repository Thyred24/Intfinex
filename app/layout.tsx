"use client"

import { Provider } from "@/components/ui/provider"
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
          <Background />
          <Header />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  )
}