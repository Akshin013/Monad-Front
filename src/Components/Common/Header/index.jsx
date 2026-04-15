import Link from 'next/link'
import React from 'react'
import Dealers from '@/app/Dealers/Page'
import Home from '@/app/page'
import Banks from '@/app/Banks/Page'

const Header = () => {
  return (
    <div>
      <div>ss
        <Link href="/">Home</Link>
        <Link href="/Banks">Banks</Link>
        <Link href="/Dealers">Dilers</Link>
      </div>
    </div>
  )
}

export default Header
