import { useRef } from 'react';
import dirUpload from '../assets/images/directory-black.svg';
// import appLogo from '../assets/images/ReactRelay.svg'
import appLogo from '../assets/images/ReactRelay-logos/ReactRelay-logos_white.png';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue, setShowSearch } from '../features/searchSlice';


function Header({}): JSX.Element {
  const dispatch = useDispatch();
  const searchBar = useSelector((state: any) => state.search.searchValue);
  const showSearch = useSelector((state: any) => state.search.showSearch);

  const searchInputRef = useRef<HTMLInputElement | null>(null);


  const handleSearchClick = () => {

    dispatch(setShowSearch());

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  return (
    <header className='flex justify-between p-3 bg-primary'>
      <div className="w-[300px]">
        <img className='object-cover h-[50px] ml-[-35px] w-full' src={appLogo} />
      </div>


      <div className='flex items-center'>
        {showSearch && (
          <input
            ref={searchInputRef}
            id="search-input"
            className="input border p-3 input-sm"
            type="text"
            id='componentSearch'
            onChange={(e) => dispatch(setSearchValue(e.target.value))}
            value={searchBar}
            placeholder="Search components"  />
        )}

        <button className="btn btn-ghost mx-2" onClick={handleSearchClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>

        <div className="tooltip tooltip-left" data-tip="Open a new project">
          <button className="btn" onClick={() => window.openExplorerModal.showModal()}><img className='h-7' src={dirUpload} alt='open folder button' /></button>
        </div>
      </div>
    </header>
  )
}

export default Header