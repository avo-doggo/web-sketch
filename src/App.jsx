import './Styles/App.css'
import { HashRouter as Router, Routes, Route, HashRouter } from 'react-router-dom'
import { Home } from './Pages/home'
import { Canvas } from './Pages/Canvas'
import { About } from './Pages/About'
import { Help } from './Pages/Help'
import { Account } from './Pages/Account'
import { Layout } from './Layout'
import { Works } from './Pages/Works'

function App() {

  return (
    <Router>
      <div className='App'>
        <div className='menu-container'>
          <div className='menu-trigger'>

          </div>
        </div>
      </div>
      <Routes>
        <Route element={<Layout/>}>
        <Route path="/" element ={<Home/>}/>
        <Route path="/Account" element ={<Account/>}/>
        <Route path="/About" element ={<About/>}/>
        <Route path="/Help" element ={<Help/>}/>
        <Route path="/Canvas" element ={<Canvas/>}/>
        <Route path="/Works" element ={<Works/>}/>
        </Route>
       
      </Routes>
    </Router>
  )

}

export default App;