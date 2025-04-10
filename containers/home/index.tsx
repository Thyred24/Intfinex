import Hero from '@/components/hero'
import React from 'react'
import InfoSection from '@/components/info'
import AboutUs from '@/components/about'
import Faq from '@/components/faq'

function HomeContainer() {
  return (
    <>
      <Hero />
      <InfoSection />
      <AboutUs />
      <Faq />
    </>
  )
}

export default HomeContainer