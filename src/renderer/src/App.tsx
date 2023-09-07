import 'tailwindcss/tailwind.css';
import { useSelector } from 'react-redux'
import Header from './components/Header';
import Tree from './components/Tree';
import ProjectPathModal from './components/ProjectPathModal';
import Details from './components/Details';


function App(): JSX.Element {
  const componentName = useSelector(state => state.project.componentName)

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <ProjectPathModal />
      <Tree />
      {componentName !== '' &&
      <Details />}
    </div>
  )
}

export default App
