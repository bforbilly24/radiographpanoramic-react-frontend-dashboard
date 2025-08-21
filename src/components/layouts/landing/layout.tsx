import React from 'react'
import Footer from '@/features/home/components/marketing/footer'
import Navbar from '@/features/home/components/marketing/navbar'

interface Props {
  children: React.ReactNode
}

const LandingLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className='mx-auto w-full z-40 relative'>{children}</main>
      <Footer />
    </>
  )
}

export default LandingLayout
