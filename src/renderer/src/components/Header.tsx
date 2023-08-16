// import React from 'react'
import dirUpload from '../assets/images/directory-black.svg'

function Header({onClick, projectName}) {
  // is this where we are gonna wanna start using redux, to keep track of file path state?
  return (
    <header className='flex justify-between p-8 bg-primary'>
     <h1 className='text-2xl font-bold text-black'>ReactRelay</h1>
     <div className='flex m-0'>
       <p className='inline text-lg'>{projectName}</p>
       <button className="btn" onClick={onClick}><img className='h-8' src={dirUpload} alt='open folder button'/></button>
     </div>
    </header>
  )
}

export default Header