import React from 'react'
import dirUpload from '../assets/images/directory-white.svg'

function Header({onClick, projectName}) {
  // is this where we are gonna wanna start using redux, to keep track of file path state?
  return (
    <header className='flex justify-between p-8'>
     <h1 className='text-2xl font-bold'>ReactRelay</h1>
     <div className='flex gap-7'>
       <p className='inline text-lg text-stone-100'>{projectName}</p>
       <button onClick={onClick}><img className='h-8' src={dirUpload} alt='open folder button'/></button>
     </div>
    </header>
  )
}

export default Header