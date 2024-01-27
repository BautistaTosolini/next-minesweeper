import Link from 'next/link'
import Contacts from './Contacts';

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center p-4 px-8 sticky top-0 bg-sky border-b-4 border-sky2'>
      <h1 className='text-3xl font-bold text-white'>
        <Link href='/'>next-minesweeper</Link>
      </h1>
      <div>
        <Contacts />
      </div>
    </nav>
  )
}

export default Navbar;