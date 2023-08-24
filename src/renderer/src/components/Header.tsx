import dirUpload from '../assets/images/directory-black.svg'
// import appLogo from '../assets/images/ReactRelay.svg'
import appLogo from '../assets/images/ReactRelay-logos/ReactRelay-logos_white.png'

function Header({openFileExplorer, projectName}) {
  return (
    <header className='flex justify-between p-8 bg-primary'>
      <div>
        <img className='object-none h-[45px] w-[440px]' src={appLogo}/>
      </div>
      <div className='flex items-center'>

        <p className='text-lg mx-2'>{projectName}</p>
        <div className="tooltip tooltip-left" data-tip="Open a new project">
          <button className="btn" onClick={openFileExplorer}><img className='h-7' src={dirUpload} alt='open folder button'/></button>

        </div>

        {/* <button className="btn bg-accent" onClick={openFileExplorer}><img className='h-7' src={dirUpload} alt='open folder button'/></button> */}
      </div>
    </header>
  )
}

export default Header