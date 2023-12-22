import { UserButton } from '@clerk/nextjs'
import { AlignJustify } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function TopHeader() {
  return (
    <div className='flex p-5 border-b items-center justify-between md:justify-end'>
      <AlignJustify className='md:hidden '/>
      <Image src='/logo.svg' height={70} width={90} className='md:hidden' alt=''/>
      <UserButton/>
    </div>
  )
}

export default TopHeader
