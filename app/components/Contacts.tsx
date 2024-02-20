'use client'

import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link'

const Contacts = () => {
  return (
    <div className='flex gap-4'>
      <span className='text-white hover:text-slate-300 transition'>
        <Link href='https://www.linkedin.com/in/bautista-tosolini/'>
          <Linkedin />
        </Link>
      </span>
      <span className='text-white hover:text-slate-300 transition'>
        <Link href='https://github.com/BautistaTosolini'>
          <Github />
        </Link>
      </span>
    </div>
  )
}

export default Contacts;