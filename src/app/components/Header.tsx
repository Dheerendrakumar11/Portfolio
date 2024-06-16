import React from 'react'
import { createClient } from '@/prismicio';
import Link from "next/link"
import { PrismicNextLink } from '@prismicio/next';
import NavBar from './NavBar';

export default async function Header() {
  
    const client = createClient();
    const settings = await client.getSingle("settings")

  return (
    <header className=' top-0 z-50 max-w-screen md: sticky md:top-4 '>


      <NavBar settings={settings}/>
    </header>
  )
}
 
