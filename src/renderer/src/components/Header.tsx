import dirUpload from '../assets/images/directory-black.svg'

function Header({openFileExplorer, projectName}) {
  return (
    <header className='flex justify-between p-8 bg-primary'>
      <h1 className='text-2xl font-bold text-black'>ReactRelay</h1>
      <div className='flex items-center'>
        
        <p className='text-lg mx-2'>{projectName}</p>
        <div className="tooltip tooltip-left" data-tip="Open a new project">  
          <button className="btn bg-accent" onClick={openFileExplorer}><img className='h-7' src={dirUpload} alt='open folder button'/></button>
          
        </div>

        {/* <button className="btn bg-accent" onClick={openFileExplorer}><img className='h-7' src={dirUpload} alt='open folder button'/></button> */}
      </div>
    </header>
  )
}

export default Header